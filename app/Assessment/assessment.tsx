
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { Entry } from './Entry';
import { useState } from 'react';
import axios from 'axios';


type FormInputs = {
    users: {
        name: string;
        email: string;
        phone: string;
    }[];
    usersArabic: {
        name: string;
        email: string;
        phone: string;
    }[];
};

export function Assessment() {
    const [activeTab, setActiveTab] = useState<"english" | "arabic">("english"); // Track active tab
    const [mode, setMode] = useState<"both" | "independent">("both"); // Mode for adding/removing users

    const { register, control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            users: [], // Start with empty list for English
            usersArabic: [], // Start with empty list for Arabic
        },
    });

    const { fields: englishFields, append: appendEnglish, remove: removeEnglish } = useFieldArray({
        control,
        name: "users", // Manage English users
    });

    const { fields: arabicFields, append: appendArabic, remove: removeArabic } = useFieldArray({
        control,
        name: "usersArabic", // Manage Arabic users
    });

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        console.log("English Users:", data.users);
        console.log("Arabic Users:", data.usersArabic);
        try {
            // Make POST request to the .NET API endpoint
            const response = await axios.post("http://localhost:5253/api/form/submit-fast", data);

            // Handle success response
            console.log("Response Data:", response.data);
            alert(`Success: ${response.data.status}\nEnglish Users Added: ${response.data.englishUsersAdded}\nArabic Users Added: ${response.data.arabicUsersAdded}`);
        } catch (error) {
            // Handle error
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.response?.data);
                alert("Error submitting form: " + (error.response?.data?.message || "Something went wrong!"));
            } else {
                console.error("Unexpected Error:", error);
                alert("An unexpected error occurred!");
            }
        }
    };

    // Add handler
    const handleAdd = () => {
        if (mode === "both") {
            appendEnglish({ name: "", email: "", phone: "" });
            appendArabic({ name: "", email: "", phone: "" });
        } else if (activeTab === "english") {
            appendEnglish({ name: "", email: "", phone: "" });
        } else if (activeTab === "arabic") {
            appendArabic({ name: "", email: "", phone: "" });
        }
    };

    // Remove handler
    const handleRemove = (index: number) => {
        if (mode === "both") {
            if (englishFields[index]) removeEnglish(index);
            if (arabicFields[index]) removeArabic(index);
        } else if (activeTab === "english") {
            removeEnglish(index);
        } else if (activeTab === "arabic") {
            removeArabic(index);
        }
    };

    return (
        <div className="form-container">
            <h3 className="form-heading">Manage Users</h3>

            {/* Mode Toggle */}
            <div className="switch-container">
                <span className="switch-label">Mode:</span>
                <div
                    className={`switch ${mode === "both" ? "active" : ""}`}
                    onClick={() => setMode(mode === "both" ? "independent" : "both")}
                >
                    <div
                        className={`switch-circle ${mode === "both" ? "mode-both" : "mode-independent"
                            }`}
                    ></div>
                </div>
                <div className="switch-labels">
                    <span className={mode === "both" ? "active" : "inactive"}>Only English</span>
                    <span className={mode === "independent" ? "active" : "inactive"}>English & Arabic</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="tab-container">
                <button
                    className={`tab-button ${activeTab === "english" ? "active" : ""}`}
                    onClick={() => setActiveTab("english")}
                >
                    English
                </button>
                <button
                    className={`tab-button ${activeTab === "arabic" ? "active" : ""}`}
                    onClick={() => setActiveTab("arabic")}
                >
                    Arabic
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* English Tab */}
                {activeTab === "english" && (
                    <>
                        {/* Render Add Button if no inputs exist */}
                        {englishFields.length === 0 && (
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="button add mb-4"
                            >
                                Add User
                            </button>
                        )}
                        {englishFields.map((field, index) => (
                            <div key={field.id} className="border border-gray-700 rounded-lg p-4 mb-4 bg-gray-700 shadow-sm">
                                <div className="form-group">
                                    <label htmlFor={`users.${index}.name`} className="form-label">Name:</label>
                                    <input
                                        id={`users.${index}.name`}
                                        type="text"
                                        {...register(`users.${index}.name`, { required: "Name is required" })}
                                        placeholder="Enter name"
                                        className="form-input"
                                    />
                                    {errors.users?.[index]?.name && (
                                        <p className="mt-1 text-sm text-red-400">{errors.users[index].name?.message}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`users.${index}.email`} className="form-label">Email:</label>
                                    <input
                                        id={`users.${index}.email`}
                                        type="email"
                                        {...register(`users.${index}.email`, {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Enter a valid email",
                                            },
                                        })}
                                        placeholder="Enter email"
                                        className="form-input"
                                    />
                                    {errors.users?.[index]?.email && (
                                        <p className="mt-1 text-sm text-red-400">{errors.users[index].email?.message}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`users.${index}.phone`} className="form-label">Phone:</label>
                                    <input
                                        id={`users.${index}.phone`}
                                        type="tel"
                                        {...register(`users.${index}.phone`, {
                                            required: "Phone is required",
                                            pattern: {
                                                value: /^[0-9]{10,15}$/,
                                                message: "Enter a valid phone number",
                                            },
                                        })}
                                        placeholder="Enter phone"
                                        className="form-input"
                                    />
                                    {errors.users?.[index]?.phone && (
                                        <p className="mt-1 text-sm text-red-400">{errors.users[index].phone?.message}</p>
                                    )}
                                </div>

                                {/* Add/Remove Buttons */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        className="button add mr-2"
                                    >
                                        Add User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="button remove"
                                    >
                                        Remove User
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Arabic Tab */}
                {activeTab === "arabic" && (
                    <>
                        {/* Render Add Button if no inputs exist */}
                        {arabicFields.length === 0 && (
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="button add mb-4"
                            >
                                Add User
                            </button>
                        )}
                        {arabicFields.map((field, index) => (
                            <div key={field.id} className="border border-gray-700 rounded-lg p-4 mb-4 bg-gray-700 shadow-sm">
                                <div className="form-group">
                                    <label htmlFor={`usersArabic.${index}.name`} className="form-label">الاسم:</label>
                                    <input
                                        id={`usersArabic.${index}.name`}
                                        type="text"
                                        {...register(`usersArabic.${index}.name`, { required: "الاسم مطلوب" })}
                                        placeholder="ادخل الاسم"
                                        className="form-input"
                                    />
                                    {errors.usersArabic?.[index]?.name && (
                                        <p className="mt-1 text-sm text-red-400">{errors.usersArabic[index].name?.message}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`usersArabic.${index}.email`} className="form-label">البريد الإلكتروني:</label>
                                    <input
                                        id={`usersArabic.${index}.email`}
                                        type="email"
                                        {...register(`usersArabic.${index}.email`, {
                                            required: "البريد الإلكتروني مطلوب",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "أدخل بريد إلكتروني صحيح",
                                            },
                                        })}
                                        placeholder="أدخل البريد الإلكتروني"
                                        className="form-input"
                                    />
                                    {errors.usersArabic?.[index]?.email && (
                                        <p className="mt-1 text-sm text-red-400">{errors.usersArabic[index].email?.message}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`usersArabic.${index}.phone`} className="form-label">الهاتف:</label>
                                    <input
                                        id={`usersArabic.${index}.phone`}
                                        type="tel"
                                        {...register(`usersArabic.${index}.phone`, {
                                            required: "رقم الهاتف مطلوب",
                                            pattern: {
                                                value: /^[0-9]{10,15}$/,
                                                message: "أدخل رقم هاتف صحيح",
                                            },
                                        })}
                                        placeholder="أدخل رقم الهاتف"
                                        className="form-input"
                                    />
                                    {errors.usersArabic?.[index]?.phone && (
                                        <p className="mt-1 text-sm text-red-400">{errors.usersArabic[index].phone?.message}</p>
                                    )}
                                </div>

                                {/* Add/Remove Buttons */}
                                {mode === "independent" && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleAdd}
                                            className="button add mr-2"
                                        >
                                            Add User
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(index)}
                                            className="button remove"
                                        >
                                            Remove User
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}

                <button type="submit" className="button submit">
                    Submit
                </button>
            </form>
        </div>
    );
}