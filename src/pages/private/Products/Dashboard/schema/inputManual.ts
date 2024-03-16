import * as Yup from 'yup';

export const inputManualSchema = Yup.object().shape({
    productId: Yup.string()
        .required('O campo Nome é obrigatório.'),

    qtd: Yup.string()
        .required('O campo é obrigatório.'),


    name: Yup.string()
        .required('O campo Nome é obrigatório.')
        .min(3, 'O nome deve ter pelo menos 3 caracteres.')
        .max(50, 'O nome deve ter no máximo 50 caracteres.'),

    price: Yup.string()
        .required('O campo é obrigatório.'),

    brand: Yup.string()
        .required('O campo é obrigatório.'),

    table: Yup.string()
        .required('O campo é obrigatório.')
});

export const inputManualSchemaInitialValues = {
    productId: '',
    qtd: '',
    name: '',
    price: '',
    brand: '',
    table: ''
}
