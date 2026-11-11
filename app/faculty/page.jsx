import { log } from "console";
import FacultySearch from "../Components/Faculty/FacultySearch";
import FacultyCardContainer from "../Components/Faculty/Facultycardcontainer";

import { getFacultyAction } from "@/actions/faculty";

const FacultyHomePage = async () => {
  const result = await getFacultyAction();

  const faculty = result.success ? result.faculty : [];
  log("Faculty is here", faculty);

  return (
    <div>
      <FacultySearch />
      <FacultyCardContainer faculty={faculty} />
    </div>
  );
};

export default FacultyHomePage;
