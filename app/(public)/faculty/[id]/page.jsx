import { notFound } from "next/navigation";
import FacultyDetails from "../../Components/Faculty/FacultyDetails";
import { FACULTY_LIST, DEPARTMENTS } from "../../Components/Faculty/temp.js";


// Dev only: look up in the static list. Later, fetch GET /api/v1/faculty/:id
// and call notFound() on a 404 response.
function getFaculty(id) {
    const f = FACULTY_LIST.find((x) => String(x._id) === String(id));
    if (!f) return null;
    return {
        ...f,
        departments: DEPARTMENTS.filter((d) => f.departmentIds.includes(d._id)),
    };
}

export async function generateMetadata({ params }) {
    const { id } = await params; // works on Next 14 and 15+
    const faculty = getFaculty(id);
    return { title: faculty ? `${faculty.name} | Faculty` : "Faculty not found" };
}

export default async function FacultyDetailsPage({ params }) {
    const { id } = await params;
    const faculty = getFaculty(id);
    if (!faculty) notFound();

    return <FacultyDetails faculty={faculty} />;
}