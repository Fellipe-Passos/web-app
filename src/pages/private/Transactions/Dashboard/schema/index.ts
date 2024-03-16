import * as Yup from 'yup';
import { TransactionsEnum } from '../index.service';

export const transactionSchema = Yup.object().shape({
    value: Yup.string()
        .required('O campo Nome é obrigatório.'),

    description: Yup.string()
        .required('O campo é obrigatório.'),

    clientId: Yup.string().required('O campo é obrigatório.'),
    type: Yup.string().required('O campo é obrigatório.'),
    discount: Yup.string().nullable()
});

export const transactionValues = {
    value: '',
    description: '',
    clientId: '',
    type: TransactionsEnum.DEBT,
    discount: ''
}
