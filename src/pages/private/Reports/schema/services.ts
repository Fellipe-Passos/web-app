import * as Yup from 'yup';

export const serviceSchema = Yup.object().shape({
    startDate: Yup.date()
        .required('O campo Nome é obrigatório.'),

    finalDate: Yup.date()
        .required('O campo é obrigatório.'),

    serviceId: Yup.string()
        .nullable(),
});

export const serviceSchemaInitialValues = {
    startDate: '',
    finalDate: '',
    serviceId: undefined
}
