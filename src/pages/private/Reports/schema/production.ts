import * as Yup from 'yup';

export const productionSchema = Yup.object().shape({
    startDate: Yup.date()
        .required('O campo Nome é obrigatório.'),

    finalDate: Yup.date()
        .required('O campo é obrigatório.'),

    userId: Yup.string()
        .nullable(),
});

export const productionSchemaInitialValues = {
    startDate: '',
    finalDate: '',
    userId: undefined
}
