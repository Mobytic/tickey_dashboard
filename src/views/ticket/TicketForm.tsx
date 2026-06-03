import { useState, useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Notification, toast } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAppSelector } from '@/store'
import { apiTicketCreate, apiTicketUpdate } from '@/services/ticketService'
import { apiCategoryIndex } from '@/services/categoryService'
import { apiWebsiteIndex } from '@/services/AuthService' // Provenant de ton controlleur Auth
import { apiTicketStatusIndex } from '@/services/ticketStatusService'
import { apiNametagIndex } from '@/services/nametagService'
import type { Ticket, TicketRequest } from '@/@types/ticket'
import type { Category } from '@/@types/category'
import type { TicketStatus } from '@/@types/ticketStatus'
import type { Nametag } from '@/@types/nametag'
import { UserRole } from '@/@types/auth'
import { Website } from '@/@types/website'

interface TicketFormProps {
    initialData?: Ticket | null
    onSuccess?: () => void
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Le titre du ticket est obligatoire'),
    bugLink: Yup.string().required('Merci de signaler la page concernée'),
    clientComment: Yup.string()
        .min(25, 'La description doit contenir au moins 25 caractères')
        .required('La description est obligatoire'),
    teamComment: Yup.string(),
    mailComment: Yup.string(),
    websiteId: Yup.number().required('Veuillez sélectionner un site web'),
    categoryId: Yup.number().required('Veuillez sélectionner une catégorie'),
    statusId: Yup.mixed()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable(),
    nametagId: Yup.mixed()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable(),
})

const TicketForm = ({ initialData, onSuccess }: TicketFormProps) => {
    const isEditMode = Boolean(initialData?.id)
    const user = useAppSelector((state) => state.auth.user) 
    const isAdmin = user?.authority?.includes(UserRole.admin)

    const [websites, setWebsites] = useState<Website[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [statuses, setStatuses] = useState<TicketStatus[]>([])
    const [nametags, setNametags] = useState<Nametag[]>([])

    useEffect(() => {
        const loadDependencies = async () => {
            try {
                const [resCat, resStat, resTag] = await Promise.all([
                    apiCategoryIndex(),
                    apiTicketStatusIndex(),
                    apiNametagIndex()
                ])
                setCategories(resCat.data)
                setStatuses(resStat.data)
                setNametags(resTag.data)
                
                if (isAdmin) {
                    const resWeb = await apiWebsiteIndex()
                    setWebsites(resWeb.data)
                }
            } catch (error) {
                console.error('Erreur de chargement des options', error)
            }
        }
        loadDependencies()
    }, [isAdmin])

    const availableWebsites: Website[] = isAdmin 
        ? websites 
        : (user as any)?.websites || []

    const onFormSubmit = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm?: () => void 
    ) => {
        setSubmitting(true)
        
        const formattedValues: TicketRequest = {
            title: values.title,
            bugLink: values.bugLink,
            clientComment: values.clientComment,
            teamComment: values.teamComment,
            mailComment: values.mailComment,
            websiteId: Number(values.websiteId),
            categoryId: Number(values.categoryId),
            statusId: values.statusId ? Number(values.statusId) : undefined,
            nametagIds: values.nametagId ? [Number(values.nametagId)] : [],
        }

        try {
            if (isEditMode && initialData?.id) {
                const response = await apiTicketUpdate(initialData.id, formattedValues)
                toast.push(<Notification type="success" duration={3000}>{response.data.message}</Notification>, { placement: 'top-end' })
            } else {
                const response = await apiTicketCreate(formattedValues)
                toast.push(<Notification type="success" duration={3000}>{response.data.message}</Notification>, { placement: 'top-end' })
                resetForm?.() 
            }
            onSuccess?.() 
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.errors?.[0]?.message || 
                                 "Une erreur est survenue lors de l'enregistrement."

            toast.push(<Notification type="danger" duration={5000}>{errorMessage}</Notification>, { placement: 'top-end' })
        } finally {
            setSubmitting(false)
        }
    }

    const initialNametagId = initialData?.nametags?.[0]?.id || ''
    const initialStatusId = initialData?.ticketStatusId || ''
    const initialWebsiteId = initialData?.websiteId || ''

    return (
        <Formik
            initialValues={{
                title: initialData?.title || '',
                bugLink: initialData?.bugLink || '',
                clientComment: initialData?.clientComment || '',
                teamComment: initialData?.teamComment || '',
                mailComment: initialData?.mailComment || '',
                categoryId: initialData?.categoryId || '',
                statusId: initialStatusId,
                nametagId: initialNametagId,
                websiteId: initialWebsiteId,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                onFormSubmit(values, setSubmitting, resetForm)
            }}
        >
            {({ touched, errors, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Titre du ticket"
                            invalid={Boolean(errors.title && touched.title)}
                            errorMessage={errors.title as string}
                        >
                            <Field type="text" autoComplete="off" name="title" placeholder="Ex: Problème d'accès à la plateforme" component={Input} />
                        </FormItem>

                        <FormItem
                            label="Catégorie"
                            invalid={Boolean(errors.categoryId && touched.categoryId)}
                            errorMessage={errors.categoryId as string}
                        >
                            <Field as="select" name="categoryId" className="w-full p-2 border rounded-md h-10 text-sm dark:bg-gray-700 dark:border-gray-600">
                                <option value="">Sélectionner...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Site Web concerné"
                            invalid={Boolean(errors.websiteId && touched.websiteId)}
                            errorMessage={errors.websiteId as string}
                        >
                            <Field as="select" name="websiteId" className="w-full p-2 border rounded-md h-10 text-sm dark:bg-gray-700 dark:border-gray-600">
                                <option value="">Sélectionner ...</option>
                                {availableWebsites.map((site: Website) => (
                                    <option key={site.id} value={site.id}>
                                        {site.url}
                                    </option>
                                ))}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Lien ou titre de la page concernée"
                            invalid={Boolean(errors.bugLink && touched.bugLink)}
                            errorMessage={errors.bugLink as string}
                        >
                            <Field name="bugLink" placeholder='www.mobytic.fr, page "à propos"...' type="text" component={Input} />
                        </FormItem>

                        <FormItem
                            label="Description détaillée"
                            invalid={Boolean(errors.clientComment && touched.clientComment)}
                            errorMessage={errors.clientComment as string}
                        >
                            <Field name="clientComment" placeholder="Décrivez votre problème ici...">
                                {({ field }: any) => (
                                    <textarea {...field} className="w-full min-h-[100px] p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                                )}
                            </Field>
                        </FormItem>

                        {isAdmin && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem label="Statut" invalid={Boolean(errors.statusId && touched.statusId)} errorMessage={errors.statusId as string}>
                                    <Field as="select" name="statusId" className="w-full p-2 border rounded-md h-10 text-sm dark:bg-gray-700 dark:border-gray-600">
                                        <option value="">Sélectionner...</option>
                                        {statuses.map((stat) => (
                                            <option key={stat.id} value={stat.id}>{stat.name}</option>
                                        ))}
                                    </Field>
                                </FormItem>

                                <FormItem label="Étiquette (Tag)" invalid={Boolean(errors.nametagId && touched.nametagId)} errorMessage={errors.nametagId as string}>
                                    <Field as="select" name="nametagId" className="w-full p-2 border rounded-md h-10 text-sm dark:bg-gray-700 dark:border-gray-600">
                                        <option value="">Aucune</option>
                                        {nametags.map((tag) => (
                                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                                        ))}
                                    </Field>
                                </FormItem>

                                <FormItem label="Commentaire de l'équipe" invalid={Boolean(errors.teamComment && touched.teamComment)} errorMessage={errors.teamComment as string}>
                                    <Field name="teamComment">
                                        {({ field }: any) => (
                                            <textarea {...field} className="w-full min-h-[100px] p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem label="Commentaire de cloture" invalid={Boolean(errors.mailComment && touched.mailComment)} errorMessage={errors.mailComment as string}>
                                    <Field name="mailComment" placeholder="Remplissez le commentaire qui sera envoyé par mail">
                                        {({ field }: any) => (
                                            <textarea {...field} className="w-full min-h-[100px] p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <Button loading={isSubmitting} variant="solid" type="submit">
                                {isEditMode ? 'Enregistrer les modifications' : 'Ouvrir le ticket'}
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default TicketForm