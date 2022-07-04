
const dataMethod = ['body', 'params', 'query', 'file', 'headers']


const validation = (schema) => {
    return (req, res, next) => {
        try {
            const listError = [];
            dataMethod.map((key) => {
                if (schema[key]) {
                    const validationResult = schema[key].validate(req[key], { abortEarly: false });
                    if (validationResult.error) {
                        listError.push(validationResult.error.details)
                    }
                }
            });

            if (listError.length) {
                res.status(400).json({ message: 'validation error', listError });
            } else {
                next();
            }
        } catch (error) {
            res.status(500).json({ message: 'catch err', error })
        }
    }

}


module.exports = validation;