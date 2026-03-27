/**
 * Формирует 32-битный код по схеме:
 * - старшие 12 бит: тип (type)
 * - следующие 4 бита: подтип (subtype)
 * - младшие 12 бит: действие (action)
 * - следующие 4 бита: описание действия (extra)
 *
 * Неуказанные параметры считаются равными 0, что удобно для создания масок
 * Возвращаемое значение 32-битное беззнаковое целое
 */
export function makeCode(type: number = 0, subtype: number = 0, action: number = 0, extra: number = 0): number {
    // Обрезаем значения до нужной разрядности
    const typeMasked = type & 0xFFF;      // 12 бит
    const subtypeMasked = subtype & 0xF;  // 4 бита
    const actionMasked = action & 0xFFF; // 12 бит
    const extraMasked = extra & 0xF; // 4 бит

    // Собираем число: сдвиги влево, затем комбинация
    // Используем >>> 0 для получения беззнакового 32-битного результата
    return ((typeMasked << 20) | (subtypeMasked << 16) | (actionMasked << 12) | extraMasked) >>> 0;
}