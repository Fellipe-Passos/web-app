import * as Yup from 'yup';


export const employeePaymentSchema = Yup.object().shape({
    payrollId: Yup.number()
        .required('O campo é obrigatório.'),

    userId: Yup.number()
        .required('O campo é obrigatório.'),

    salaryAmount: Yup.string()
        .required('O campo é obrigatório.'),

    commissionsAmount: Yup.string()
        .required('O campo é obrigatório.'),
});

export const employeePaymentSchemaInitialValues = {
    payrollId: undefined,
    salaryAmount: undefined,
    commissionsAmount: undefined,
    userId: undefined,
}