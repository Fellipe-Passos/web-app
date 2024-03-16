import * as Yup from 'yup';


export const expanseSchema = Yup.object().shape({
    dueDay: Yup.number()
        .required('O campo é obrigatório.'),

    dueMonths: Yup.array()
        .required('O campo é obrigatório.'),

    type: Yup.string()
        .required('O campo é obrigatório.'),

    value: Yup.string()
        .required('O campo é obrigatório.'),

    description: Yup.string()
        .required('O campo é obrigatório.')

});

export const expanseSchemaInitialValues = {
    dueDay: 1,
    dueMonths: [],
    type: '',
    value: 'undefined',
    description: ''
}
