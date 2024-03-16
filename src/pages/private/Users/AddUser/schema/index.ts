import * as Yup from 'yup';

export const userSchema = Yup.object().shape({
    name: Yup.string()
        .required('O campo Nome é obrigatório.')
        .min(3, 'O nome deve ter pelo menos 3 caracteres.')
        .max(50, 'O nome deve ter no máximo 50 caracteres.'),

    CPF: Yup.string()
        .required('O campo CPF é obrigatório.'),

    role: Yup.string()
        .required('O campo Setor é obrigatório.')
});

export const userSchemaInitialValues = {
    name: '',
    CPF: '',
    role: ''
}
