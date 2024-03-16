import * as Yup from 'yup';


export const payrollSchema = Yup.object().shape({
    paymentDay: Yup.number()
        .required('O campo é obrigatório.'),

    userId: Yup.number()
        .required('O campo é obrigatório.'),
});

export const payrollSchemaInitialValues = {
    paymentDay: 1,
    userId: undefined,
}
