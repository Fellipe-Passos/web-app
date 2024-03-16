import * as Yup from 'yup';

const CreatePasswordSchema = Yup.object().shape({
    login: Yup
        .string()
        .required('É necessário preencher este campo.'),
    password: Yup
        .string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres')
        .required('É necessário preencher este campo.'),
    confirm: Yup
        .string()
        .oneOf([Yup.ref('password'), ''], 'As senhas precisam ser iguais')
        .required('É necessário preencher este campo.'),
});


const CreatePasswordSchemaInitialValues = {
    login: '',
    password: '',
    confirm: ''
};

export { CreatePasswordSchema, CreatePasswordSchemaInitialValues };