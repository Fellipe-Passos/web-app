import * as Yup from 'yup';

export const categorySchema = Yup.object().shape({
    category: Yup.string().required("É necessário preencher este campo.")
});

export const categorySchemaInitialValues = {
    category: ''
}
