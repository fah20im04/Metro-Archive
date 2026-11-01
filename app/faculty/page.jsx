import React from 'react';
import FacultySearch from '../Components/Faculty/FacultySearch';
import FacultyCardContainer from '../Components/Faculty/Facultycardcontainer';

const FacultyHomePage = () => {
    return (
        <div>
            <FacultySearch />
            <FacultyCardContainer />
        </div>
    );
};

export default FacultyHomePage;
