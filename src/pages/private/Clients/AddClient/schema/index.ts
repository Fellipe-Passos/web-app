import * as Yup from 'yup';

export const clientSchema = Yup.object().shape({
    name: Yup.string()
        .required('O campo Nome é obrigatório.')
        .min(3, 'O nome deve ter pelo menos 3 caracteres.')
        .max(50, 'O nome deve ter no máximo 50 caracteres.'),

    cro: Yup.string()
        .required('O campo é obrigatório.'),

    phone: Yup.string()
        .required('O campo é obrigatório.'),

    city: Yup.string()
        .required('O campo é obrigatório.'),

    district: Yup.string()
        .required('O campo é obrigatório.'),

    number: Yup.number()
        .required('O campo é obrigatório.'),

    state: Yup.string()
        .required('O campo é obrigatório.'),

    street: Yup.string()
        .required('O campo é obrigatório.'),

    zip: Yup.string()
        .required('O campo é obrigatório.'),

    complement: Yup.string()
        .nullable(),

    CPF: Yup.string()
        .required('O campo é obrigatório.'),

    email: Yup.string().email('Email inválido')
        .required('O campo é obrigatório.'),
});

export const clientSchemaInitialValues = {
    name: '',
    phone: '',
    cro: '',
    city: '',
    district: '',
    number: undefined,
    state: '',
    street: '',
    zip: '',
    complement: '',
    CPF: '',
    email: ''
};
