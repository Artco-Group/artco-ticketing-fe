interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({
  password,
}: PasswordStrengthMeterProps) => {
  const calculateStrength = (
    pwd: string
  ): {
    score: number;
    label: string;
    color: string;
  } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    return { score: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const { score, label, color } = calculateStrength(password);

  return (
    <div className="mt-2">
      <div className="bg-greyscale-100 flex h-1 w-full gap-1 overflow-hidden rounded-full">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 transition-all duration-300 ${
              level <= score && password ? color : 'bg-greyscale-100'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className="text-greyscale-500 mt-1 text-[12px]">Strength: {label}</p>
      )}
    </div>
  );
};
