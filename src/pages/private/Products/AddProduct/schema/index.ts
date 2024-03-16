import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
    name: Yup.string()
        .required('O campo Nome é obrigatório.')
        .min(3, 'O nome deve ter pelo menos 3 caracteres.')
        .max(50, 'O nome deve ter no máximo 50 caracteres.'),

    price: Yup.string()
        .required('O campo é obrigatório.'),

    brand: Yup.string()
        .required('O campo é obrigatório.'),
    qtd: Yup.string()
        .required('O campo é obrigatório.'),
    table: Yup.string()
        .required('O campo é obrigatório.')
});

export const productSchemaInitialValues = {
    name: '',
    price: '',
    brand: '',
    qtd: '',
    table: ''
}
