'use-strict';

module.exports = class FacadeProvider {
    constructor(TargetClass, ...args) {
        const targetClass = new TargetClass(...args);
        const methodList = targetClass.facade || [];
        
        methodList.forEach(facadeMethod => {
            Object.defineProperty(this, facadeMethod, {
                get: targetClass[facadeMethod]
            });
        });
    }
}