import * as Yup from 'yup';

export const serviceSchema = Yup.object().shape({
    name: Yup.string()
        .required('O campo Nome é obrigatório.')
        .min(3, 'O nome deve ter pelo menos 3 caracteres.')
        .max(50, 'O nome deve ter no máximo 50 caracteres.'),

    price: Yup.string()
        .required('O campo é obrigatório.'),

    commissionedItem: Yup.boolean().nullable()
});

export const serviceSchemaInitialValues = {
    name: '',
    price: '',
    commissionedItem: false
}
