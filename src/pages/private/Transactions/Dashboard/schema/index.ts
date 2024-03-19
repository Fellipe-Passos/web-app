import * as Yup from 'yup';
import { TransactionsEnum } from '../index.service';

export const transactionSchema = Yup.object().shape({
    value: Yup.string()
        .required('O campo Nome é obrigatório.'),

    description: Yup.string()
        .required('O campo é obrigatório.'),

    clientId: Yup.string().required('O campo é obrigatório.'),
    type: Yup.string().required('O campo é obrigatório.'),
    discount: Yup.string().nullable(),

    orderId: Yup.string().nullable(),

    billingType: Yup.string().nullable(),

    dueDate: Yup.date().nullable(),

    installmentCount: Yup.string().nullable(),

    installmentValue: Yup.string().nullable()
});

export const transactionValues = {
    value: '',
    description: '',
    clientId: '',
    type: TransactionsEnum.DEBT,
    discount: '',
    orderId: undefined,
    billingType: undefined,
    dueDate: undefined,
    installmentCount: undefined,
    installmentValue: undefined
}
