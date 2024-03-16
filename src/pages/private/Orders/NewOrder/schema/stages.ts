import * as Yup from 'yup';

export const stageSchema = Yup.object().shape({
    role: Yup.string().required('Campo obrigatório'),
    professionalId: Yup.string().required('Campo obrigatório'),
    time: Yup.date().required('Campo obrigatório'),
});

export const stageSchemaInitialValues = {
    role: '',
    professionalId: '',
    time: '',
}
