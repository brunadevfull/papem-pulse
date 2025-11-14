import { execFile } from 'node:child_process';

const HASH_SCRIPT = `import crypt, sys, warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
password = sys.argv[1]
cost = int(sys.argv[2])
if cost < 4 or cost > 31:
    raise ValueError('Cost must be between 4 and 31')
rounds = 1 << cost
salt = crypt.mksalt(crypt.METHOD_BLOWFISH, rounds=rounds)
result = crypt.crypt(password, salt)
if result is None:
    raise ValueError('Unable to hash password with bcrypt')
print(result)
`;

const VERIFY_SCRIPT = `import crypt, sys, warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
password = sys.argv[1]
hashed = sys.argv[2]
calc = crypt.crypt(password, hashed)
if calc is None:
    raise ValueError('Unable to verify password with bcrypt')
print('1' if calc == hashed else '0')
`;

const PYTHON_CANDIDATES = (() => {
  const candidates: string[] = [];
  const fromEnv = process.env.PYTHON?.trim();

  if (fromEnv) {
    candidates.push(fromEnv);
  }

  for (const candidate of ['python', 'python3', 'py']) {
    if (!candidates.includes(candidate)) {
      candidates.push(candidate);
    }
  }

  return candidates;
})();

function executeWithPython(
  executable: string,
  script: string,
  args: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const child = execFile(
      executable,
      ['-c', script, ...args],
      { encoding: 'utf8' },
      (error, stdout, stderr) => {
        if (settled) {
          return;
        }

        if (error) {
          settled = true;
          const details = stderr ? `: ${stderr.trim()}` : '';
          const execError = new Error(
            `Python execution failed using "${executable}"${details}`
          );
          (execError as { cause?: unknown }).cause = error;
          reject(execError);
          return;
        }

        settled = true;
        resolve(stdout.trim());
      }
    );

    child.on('error', (spawnError) => {
      if (settled) {
        return;
      }

      settled = true;
      const execError = new Error(
        `Failed to start Python executable "${executable}": ${spawnError.message}`
      );
      (execError as { cause?: unknown }).cause = spawnError;
      reject(execError);
    });
  });
}

async function runPython(script: string, args: string[]): Promise<string> {
  const spawnErrors: string[] = [];

  for (const executable of PYTHON_CANDIDATES) {
    try {
      return await executeWithPython(executable, script, args);
    } catch (error) {
      const cause = (error as { cause?: unknown })?.cause;
      const isSpawnError =
        !!cause && typeof cause === 'object' && 'code' in cause &&
        (cause as { code?: unknown }).code === 'ENOENT';

      if (isSpawnError) {
        spawnErrors.push((error as Error).message);
        continue;
      }

      throw error;
    }
  }

  const errorMessage =
    spawnErrors.length > 0
      ? `Unable to locate a working Python executable. Tried ${PYTHON_CANDIDATES.join(
          ', '
        )}. Errors: ${spawnErrors.join(' | ')}`
      : 'Unable to execute Python script.';

  throw new Error(errorMessage);
}

function toSaltHashFormat(fullHash: string): string {
  if (typeof fullHash !== 'string') {
    return fullHash;
  }

  if (fullHash.includes(':')) {
    return fullHash;
  }

  if (fullHash.startsWith('$2') && fullHash.length >= 30) {
    const saltPart = fullHash.slice(0, 29);
    const hashPart = fullHash.slice(29);

    if (saltPart && hashPart) {
      return `${saltPart}:${hashPart}`;
    }
  }

  return fullHash;
}

function normalizeStoredHash(storedHash: string): string {
  if (typeof storedHash !== 'string' || storedHash.length === 0) {
    return '';
  }

  if (!storedHash.includes(':')) {
    return storedHash;
  }

  const [saltPart, hashPart] = storedHash.split(':');

  if (!saltPart || !hashPart) {
    return storedHash;
  }

  return `${saltPart}${hashPart}`;
}

export async function hashPassword(password: string, cost = 12): Promise<string> {
  const trimmedPassword = password ?? '';
  const fullHash = await runPython(HASH_SCRIPT, [trimmedPassword, String(cost)]);
  return toSaltHashFormat(fullHash);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  const normalizedHash = normalizeStoredHash(hashed ?? '');
  const result = await runPython(VERIFY_SCRIPT, [password ?? '', normalizedHash]);
  return result === '1';
}
