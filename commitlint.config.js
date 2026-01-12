export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-empty': [0],
    'type-empty': [0],
    'artco-ticket-format': [2, 'always'],
    'subject-case': [0],
  },
  plugins: [
    {
      rules: {
        'artco-ticket-format': ({ raw }) => {
          const pattern =
            /^(feat|fix|docs|style|refactor|test|chore|build|ci)(\([a-z-]+\))?: ARTCOCRM-[0-9]+ .+$/;
          return [
            pattern.test(raw.trim()),
            'Commit message must match: type(scope): ARTCOCRM-XXX description',
          ];
        },
      },
    },
  ],
};
