import { UserRoles } from "../types/user";

export function formatCurrency(value: number | string): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const formattedValue = numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return formattedValue;
}

export function removeCurrencyMask(value: string): number {// Remove o símbolo de R$ e os pontos separadores de milhar
    const cleanString = value?.replace('R$', '')?.replace(/\./g, '');

    // Substitui a vírgula decimal por um ponto decimal
    const dotDecimalString = cleanString?.replace(',', '.');

    // Converte a string para float
    const floatValue = parseFloat(dotDecimalString);

    return floatValue;
}

export function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function removeCPFMask(cpf: string | undefined | null): string {
    if (!cpf) return ''
    return cpf.replace(/\D/g, '');
}

export function humanizeCellphone(value: string): string {
    if (value && value.length > 11) {
        const cellphone = value.replace(/[^\d]/g, '');
        return cellphone.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '($2) $3-$4');
    } if (value && value.length <= 11) {
        const cellphone = value.replace(/[^\d]/g, '');
        return cellphone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return '';
}

export function humanizeCPF(value: string): string {
    if (value && value.length) {
        const cpf = value.replace(/[^\d]/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return '';
}

export function translateRole(role?: UserRoles): string {
    if (!role) return '-'

    if (role === UserRoles.Administration) {
        return "Administração"
    }

    if (role === UserRoles.Digital) {
        return "Digital"
    }

    if (role === UserRoles.Finishing) {
        return "Acabamento"
    }

    if (role === UserRoles.Milling) {
        return 'Fresagem'
    }

    if (role === UserRoles.Plaster) {
        return 'Gesso'
    }

    if (role === UserRoles.Root) {
        return 'Root'
    }

    if (role === UserRoles.Ceo) {
        return 'CEO'
    }

    if (role === UserRoles.Manager) {
        return 'Gerente'
    }

    if (role === UserRoles.ScreeningAdministration) {
        return "Administração de triagem"
    }

    return '-'
}