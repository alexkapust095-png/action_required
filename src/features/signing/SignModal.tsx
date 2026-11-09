import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './SignModal.css'
import '../../entities/search/MultiSelect.css'
import { CertificateData, TaskInfo } from '../../types/types'
import { getWidgetParams } from '../../shared/widgetParams'
import { SingleSelect } from '../../entities/search/SingleSelect'
import { Loader } from '../../shared/loader/Loader'

type SignPhase = 'idle' | 'signing' | 'signed'

/**
 * Модальное окно «Подписать выбранное».
 * - открывается по кнопке «Подписать выбранные» на панели действий;
 * - внутри — список выбранных документов с возможностью исключить что-то
 *   и выпадающий список сертификатов (одиночный выбор);
 * - «Подписать» вызывает переданную функцию подписания, показывает колесо
 *   загрузки, по завершении — надпись «Документы подписаны!»;
 * - «Отмена», клик по подложке и Esc закрывают окно.
 */
export function SignModal(props: {
    /** Выбранные задачи (все с action_type.code === 'signing') */
    tasks: TaskInfo[]
    onClose: () => void
    /** После успешного подписания: обновить список задач как по кнопке «Обновить» */
    onSigned: (hideSpinner?: boolean) => void
}) {
    // ID текущего пользователя elma365, Функции для работы с сертификатами и подписанием берём из общего
    // хранилища параметров виджета (складываются в initWidget).
    const { getLastCert, setLastCert, loadCertificates, signDocuments, userId } = getWidgetParams()
    const modalRef = useRef<HTMLDivElement>(null)

    // Черновик списка подписания: id исключённых задач
    const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set())
    const [certificates, setCertificates] = useState<CertificateData[]>([])
    const [certificatesLoading, setCertificatesLoading] = useState(true)
    const [selectedCertificate, setSelectedCertificate] = useState<string | null>(getLastCert?.(userId) ?? null)
    const [phase, setPhase] = useState<SignPhase>('idle')

    // Загрузка сертификатов при открытии окна (п.6 — функция без параметров);
    // если функция не передана из elma365 — считаем список пустым
    useEffect(() => {
        let cancelled = false
        Promise.resolve(loadCertificates?.() ?? [])
            .then(list => {
                if (cancelled) return
                setCertificates(list ?? [])
                setCertificatesLoading(false)
            })
            .catch(() => {
                if (!cancelled) setCertificatesLoading(false)
            })
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Esc закрывает модалку (кроме момента подписания)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && phase !== 'signing') props.onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [props.onClose, phase])

    const idsToSign = props.tasks
        .map(task => task.task.id)
        .filter(id => !excludedIds.has(id))

    // «Подписать»: вызываем функцию подписания (п.5), ждём, показываем результат
    const handleSignClick = async () => {
        if (phase !== 'idle' || idsToSign.length === 0 || !selectedCertificate) return
        setPhase('signing')
        try {
            await signDocuments?.(idsToSign, selectedCertificate)
            // Устанавливаем последний сертификат в хранилище
            setLastCert?.(userId, selectedCertificate)
            setPhase('signed')
            // Обновление списка задач — как по кнопке «Обновить»
            props.onSigned(true)
        } catch {
            setPhase('idle')
        }
    }

    const canClose = phase !== 'signing'

    // Клик по затемняющей подложке (вне области самого окна) — закрыть
    const handleBackdropMouseDown = (event: React.MouseEvent) => {
        if (!canClose) return
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            props.onClose()
        }
    }

    const toggleExcluded = (taskId: string) => {
        setExcludedIds(prev => {
            const next = new Set(prev)
            if (next.has(taskId)) {
                next.delete(taskId)
            } else {
                next.add(taskId)
            }
            return next
        })
    }

    const modal = (
        <div className="task-widget sign-modal-backdrop" onMouseDown={handleBackdropMouseDown}>
            <div className="sign-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label="Подписать выбранное">
                <div className="sign-modal-header">
                    <span className="sign-modal-title">Подписать выбранное</span>
                    <button
                        type="button"
                        className="sign-modal-close"
                        aria-label="Закрыть"
                        onClick={props.onClose}
                        disabled={!canClose}
                    >
                        ×
                    </button>
                </div>

                {phase === 'signing' ? (
                    <div className="sign-modal-body">
                        <Loader label="Подписание…" />
                    </div>
                ) : phase === 'signed' ? (
                    <div className="sign-modal-body">
                        <div className="sign-modal-loading">
                            <span className="sign-success">Документы подписаны!</span>
                        </div>
                    </div>
                ) : (
                    <div className="sign-modal-body">
                        <div className="sign-field">
                            <span className="sign-label">Будут подписаны:</span>
                            <div className="sign-task-list">
                                {props.tasks.map(task => {
                                    const excluded = excludedIds.has(task.task.id)
                                    return (
                                        <label
                                            key={task.task.id}
                                            className={`sign-task-row${excluded ? ' excluded' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={!excluded}
                                                onChange={() => toggleExcluded(task.task.id)}
                                            />
                                            <span className="sign-task-name">{task.task.data.__name}</span>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="sign-field">
                            <span className="sign-label">Сертификат:</span>
                            <SingleSelect
                                options={certificates.map(cert => ({ value: cert.code, label: cert.name }))}
                                value={selectedCertificate}
                                onChange={setSelectedCertificate}
                                placeholder={certificatesLoading ? 'Загрузка сертификатов…' : 'Выберите сертификат'}
                            />
                        </div>
                    </div>
                )}

                <div className="sign-modal-footer">
                    <button
                        type="button"
                        className="sign-modal-cancel"
                        onClick={props.onClose}
                        disabled={!canClose}
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        className="sign-modal-submit"
                        onClick={handleSignClick}
                        disabled={
                            phase !== 'idle' ||
                            idsToSign.length === 0 ||
                            selectedCertificate === null ||
                            certificatesLoading
                        }
                    >
                        Подписать
                    </button>
                </div>
            </div>
        </div>
    )

    // Портал в body: fixed-подложка поверх всей страницы хоста
    return createPortal(modal, document.body)
}
