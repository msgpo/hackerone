const fp = require("lodash/fp");

const validateOptions = (options, callback) => {
  const stringOptionsErrorMessages = {
    email: 'You must provide a valid Email from you HackerOne Account',
    password: 'You must provide a valid Password from you HackerOne Account',
    programsToSearch: 'You must provide at least one valid Program to Search in HackerOne'
  };

  const stringValidationErrors = _validateStringOptions(
    stringOptionsErrorMessages,
    options
  );
  
  const commaSeparatedListError = fp.flow(
    fp.split(','),
    fp.map(fp.trim),
    fp.some(fp.includes(' '))
  )(options.programsToSearch.value)
    ? 'Program Names are not allowed to include spaces.'
    : [];

  callback(null, stringValidationErrors.concat(commaSeparatedListError));
};

const _validateStringOptions = (stringOptionsErrorMessages, options, otherErrors = []) =>
  fp.reduce(
    stringOptionsErrorMessages,
    (agg, message, optionName) => {
      const isString = typeof options[optionName].value === 'string';
      const isEmptyString = isString && fp.isEmpty(options[optionName].value);

      return !isString || isEmptyString
        ? agg.concat({
            key: optionName,
            message
          })
        : agg;
    },
    otherErrors
  );


module.exports = validateOptions;
