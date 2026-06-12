import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Notification, toast } from '@/components/ui'
import { Field, Form, Formik, FormikState } from 'formik'
import * as Yup from 'yup'
import { apiCategoryCreate, apiCategoryUpdate } from '@/services/categoryService'
import type { Category, CategoryRequest } from '@/@types/category'


interface CategoryFormProps {
    initialData?: Category | null
    onSuccess: () => void
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Le nom de la catégorie est obligatoire'),
})

const CategoryForm = ({ initialData, onSuccess }: CategoryFormProps) => {
    const isEditMode = Boolean(initialData?.id)
    const onFormSubmit = async (
        values: CategoryRequest,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            if (isEditMode && initialData?.id) {
                const response = await apiCategoryUpdate(initialData.id, { name: values.name })
                toast.push(<Notification type="success" duration={3000}>{response.data.message}</Notification>, { placement: 'top-end' })
            } else {
                const response = await apiCategoryCreate({ name: values.name })
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
                            label="Nom de la catégorie"
                            invalid={Boolean(errors.name && touched.name)}
                            errorMessage={errors.name as string}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="name"
                                placeholder="Ex: Technique, Commercial..."
                                component={Input}
                            />
                        </FormItem>

                        <div className="flex justify-end mt-4">
                            <Button
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isEditMode ? 'Mettre à jour' : 'Créer la catégorie'}
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CategoryForm