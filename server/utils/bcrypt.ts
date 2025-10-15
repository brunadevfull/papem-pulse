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

function runPython(script: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = execFile(
      'python',
      ['-c', script, ...args],
      { encoding: 'utf8' },
      (error, stdout, stderr) => {
        if (error) {
          const details = stderr ? `: ${stderr.trim()}` : '';
          reject(new Error(`Python execution failed${details}`));
          return;
        }
        resolve(stdout.trim());
      }
    );

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export async function hashPassword(password: string, cost = 12): Promise<string> {
  const trimmedPassword = password ?? '';
  return runPython(HASH_SCRIPT, [trimmedPassword, String(cost)]);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  const result = await runPython(VERIFY_SCRIPT, [password ?? '', hashed ?? '']);
  return result === '1';
}
