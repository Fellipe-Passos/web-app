import * as Yup from 'yup';

export const orderSchema = Yup.object().shape({
    patientName: Yup.string()
        .required('O campo é obrigatório.'),

    clientId: Yup.string()
        .required('O campo é obrigatório.'),

    message: Yup.string()
        .required('O campo é obrigatório.'),

    color: Yup.string()
        .nullable(),

    laboratoryColor: Yup.string().nullable(),

    materialsSendedByClient: Yup.array()
        .required('O campo é obrigatório.'),

    observations: Yup.string().nullable(),

    currentProduct: Yup.object().shape({
        productId: Yup.string(),
        amount: Yup.string()
    }),

    currentService: Yup.object().shape({
        serviceId: Yup.string(),
        dent: Yup.array(),
        amount: Yup.string()
    }),

});

export const orderSchemaInitialValues = {
    patientName: '',
    clientId: '',
    message: 'Olá {{dentista}}, PASSOS LABORATÓRIO Informa, que o material PAC: {{paciente}}, {{quantidade}} {{material}} já está no setor {{setor}}.\n\nVamos te mantendo informado(a), obrigada. 🤩',
    color: undefined,
    laboratoryColor: undefined,
    materialsSendedByClient: [],
    observations: null,
    services: [],
    products: [],
    currentProduct: {
        productId: '',
        amount: ''
    },
    currentService: {
        serviceId: '',
        dent: [],
        amount: ''
    },
}
