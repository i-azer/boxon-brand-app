
import { useForm, useFieldArray } from 'react-hook-form';

export function Assessment() {

    const { register, control, handleSubmit } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills"
    });

    const onSubmit = data => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {fields.map((field, index) => (
                <div key={field.id}>
                    <input
                        {...register(`skills.${index}.name`)}
                    />
                    <button type="button" onClick={() => remove(index)}>Delete</button>
                </div>
            ))}

            <button type="button" onClick={() => append({ name: "" })}>
                Add Skill
            </button>

            <input type="submit" />
        </form>
    );
}