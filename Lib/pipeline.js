module.exports = function pipeline(context, ...functions) {
    return (...args) => functions
        .reduce((currArg, func) => {
            if (currArg.length === 0) {
                return func.call(context);    
            }
            return func[typeof currArg === 'Array' ? 'apply' : 'call'](context, currArg);
        }, args);
}
  