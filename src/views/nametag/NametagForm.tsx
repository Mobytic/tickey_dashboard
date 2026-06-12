import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Notification, toast } from '@/components/ui'
import { Field, Form, Formik, FormikState } from 'formik'
import * as Yup from 'yup'
import { apiNametagCreate, apiNametagUpdate } from '@/services/NametagService'
import type { Nametag, NametagRequest } from '@/@types/nametag'


interface NametagFormProps {
    initialData?: Nametag | null
    onSuccess: () => void
}


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Le nom est obligatoire'),
    color: Yup.string(),
})

const NametagForm = ({ initialData, onSuccess }: NametagFormProps) => {

    const isEditMode = Boolean(initialData?.id)

    const onFormSubmit = async (
        values: NametagRequest,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            if (isEditMode && initialData?.id) {

                const response = await apiNametagUpdate(initialData.id, { name: values.name, color: values.color })
                toast.push(<Notification type="success" duration={3000}>{response.data.message}</Notification>, { placement: 'top-end' })
            } else {

                const response = await apiNametagCreate({ name: values.name, color: values.color })
                toast.push(<Notification type="success" duration={3000}>{response.data.message}</Notification>, { placement: 'top-end' })
            }
            
            onSuccess()
        } catch (error) {
            console.error(error)
            toast.push(<Notification type="danger" duration={3000}>Une erreur est survenue</Notification>, { placement: 'top-end' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={{
                name: initialData?.name || '',
                color: initialData?.color || '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onFormSubmit(values, setSubmitting)
            }}
        >
            {({ touched, errors, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Nom"
                            invalid={Boolean(errors.name && touched.name)}
                            errorMessage={errors.name as string}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="name"
                                placeholder="Ex: Pierre, Paul, Jack..."
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="Couleur"
                            invalid={Boolean(errors.color && touched.color)}
                            errorMessage={errors.color as string}
                        >
                            <Field
                                type="color"
                                name="color"
                                component={Input}
                            />
                        </FormItem>

                        <div className="flex justify-end mt-4">
                            <Button
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isEditMode ? 'Mettre à jour' : 'Créer le Nametag'}
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default NametagForm