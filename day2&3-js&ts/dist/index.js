"use strict";
function taxCalculation(amount, tax) {
    return amount * tax;
}
const tax = taxCalculation(100, 0.2);
console.log(tax);
let employee = {
    id: 1,
    name: "John",
    age: 30,
    salary: 1000,
    retire: (date) => {
        console.log("Retired on", date);
    },
};
console.log(employee);
employee.retire(new Date());
//# sourceMappingURL=index.js.map