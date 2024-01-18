module.exports = {
	root: true,
	extends: ['universe/native'],
	rules: {
		'no-throw-literal': 0,
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
	},
};
