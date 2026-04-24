import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import StudentTable from './StudentTableTemplate';
import { BASE_URL } from '../../config/config';
import AccordionPlaceholder from '../AccordionPlaceholder';

function StudentYearAndBranchView() {
  document.title = 'CPMS | All Students';

  const [loading, setLoading] = useState(true);

  const [firstYearComputer, setFirstYearComputer] = useState([]);
  const [firstYearCivil, setFirstYearCivil] = useState([]);
  const [firstYearMechanical, setFirstYearMechanical] = useState([]);
  const [firstYearAIDS, setFirstYearAIDS] = useState([]);
  const [firstYearECS, setFirstYearECS] = useState([]);
  const [secondYearComputer, setSecondYearComputer] = useState([]);
  const [secondYearCivil, setSecondYearCivil] = useState([]);
  const [secondYearMechanical, setSecondYearMechanical] = useState([]);
  const [secondYearECS, setSecondYearECS] = useState([]);
  const [secondYearAIDS, setSecondYearAIDS] = useState([]);
  const [thirdYearComputer, setThirdYearComputer] = useState([]);
  const [thirdYearCivil, setThirdYearCivil] = useState([]);
  const [thirdYearMechanical, setThirdYearMechanical] = useState([]);
  const [thirdYearECS, setThirdYearECS] = useState([]);
  const [thirdYearAIDS, setThirdYearAIDS] = useState([]);
  const [fourthYearComputer, setFourthYearComputer] = useState([]);
  const [fourthYearCivil, setFourthYearCivil] = useState([]);
  const [fourthYearMechanical, setFourthYearMechanical] = useState([]);
  const [fourthYearECS, setFourthYearECS] = useState([]);
  const [fourthYearAIDS, setFourthYearAIDS] = useState([]);

  const fetchStudentsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/student/all-students-data-year-and-branch`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setFirstYearComputer(response.data.firstYearComputer);
      setFirstYearCivil(response.data.firstYearCivil);
      setFirstYearMechanical(response.data.firstYearMechanical);
      setFirstYearECS(response.data.firstYearECS);
      setFirstYearAIDS(response.data.firstYearAIDS);

      setSecondYearComputer(response.data.secondYearComputer);
      setSecondYearCivil(response.data.secondYearCivil);
      setSecondYearMechanical(response.data.secondYearMechanical);
      setSecondYearECS(response.data.secondYearECS);
      setSecondYearAIDS(response.data.secondYearAIDS);

      setThirdYearComputer(response.data.thirdYearComputer);
      setThirdYearCivil(response.data.thirdYearCivil);
      setThirdYearMechanical(response.data.thirdYearMechanical);
      setThirdYearECS(response.data.thirdYearECS);
      setThirdYearAIDS(response.data.thirdYearAIDS);

      setFourthYearComputer(response.data.fourthYearComputer);
      setFourthYearCivil(response.data.fourthYearCivil);
      setFourthYearMechanical(response.data.fourthYearMechanical);
      setFourthYearECS(response.data.fourthYearECS);
      setFourthYearAIDS(response.data.fourthYearAIDS);

      // setLoading(false);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      // if (error?.response?.data?.msg) {
      // setToastMessage(error.response.data.msg);
      // setShowToast(true);
      // }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentsData();
  }, []);

  return (
    <>
      {
        loading ? (
          // <div className="flex justify-center h-72 items-center">
          //   <i className="fa-solid fa-spinner fa-spin text-3xl" />
          // </div>
          <AccordionPlaceholder />
        ) : (
          <>
            <div className="my-4">
              <div className="dashboard-card mb-5 rounded-2xl p-5">
                <p className="dashboard-kicker">Student Directory</p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-950">Students by Year and Branch</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Open a year group to review students, resumes, internships, and applied job counts.
                </p>
              </div>
              <div className="">
                {/* parent accordion for year of student  */}
                <Accordion defaultActiveKey={['1']} flush className='flex flex-col gap-4'>
                  <Accordion.Item eventKey="1" className='dashboard-card overflow-hidden rounded-2xl'>
                    {/* 4th year  */}
                    <Accordion.Header>Fourth Year</Accordion.Header>
                    <Accordion.Body>
                      <Accordion flush defaultActiveKey={['Computer']} className='flex flex-col gap-2'>
                        <StudentTable branchName={"Computer"} studentData={fourthYearComputer} />
                        <StudentTable branchName={"Civil"} studentData={fourthYearCivil} />
                        <StudentTable branchName={"ECS"} studentData={fourthYearECS} />
                        <StudentTable branchName={"AIDS"} studentData={fourthYearAIDS} />
                        <StudentTable branchName={"Mechanical"} studentData={fourthYearMechanical} />
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2" className='dashboard-card overflow-hidden rounded-2xl'>
                    {/* 3rd year  */}
                    <Accordion.Header>Third Year</Accordion.Header>
                    <Accordion.Body>
                      <Accordion flush defaultActiveKey={['Computer']} className='flex flex-col gap-2'>
                        <StudentTable branchName={"Computer"} studentData={thirdYearComputer} />
                        <StudentTable branchName={"Civil"} studentData={thirdYearCivil} />
                        <StudentTable branchName={"ECS"} studentData={thirdYearECS} />
                        <StudentTable branchName={"AIDS"} studentData={thirdYearAIDS} />
                        <StudentTable branchName={"Mechanical"} studentData={thirdYearMechanical} />
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="3" className='dashboard-card overflow-hidden rounded-2xl'>
                    {/* 2nd year  */}
                    <Accordion.Header>Second Year</Accordion.Header>
                    <Accordion.Body>
                      <Accordion flush defaultActiveKey={['Computer']} className='flex flex-col gap-2'>
                        <StudentTable branchName={"Computer"} studentData={secondYearComputer} />
                        <StudentTable branchName={"Civil"} studentData={secondYearCivil} />
                        <StudentTable branchName={"ECS"} studentData={secondYearECS} />
                        <StudentTable branchName={"AIDS"} studentData={secondYearAIDS} />
                        <StudentTable branchName={"Mechanical"} studentData={secondYearMechanical} />
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="4" className='dashboard-card overflow-hidden rounded-2xl'>
                    {/* 1st year  */}
                    <Accordion.Header>First Year</Accordion.Header>
                    <Accordion.Body>
                      <Accordion flush defaultActiveKey={['Computer']} className='flex flex-col gap-2'>
                        <StudentTable branchName={"Computer"} studentData={firstYearComputer} />
                        <StudentTable branchName={"Civil"} studentData={firstYearCivil} />
                        <StudentTable branchName={"ECS"} studentData={firstYearECS} />
                        <StudentTable branchName={"AIDS"} studentData={firstYearAIDS} />
                        <StudentTable branchName={"Mechanical"} studentData={firstYearMechanical} />
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>


                </Accordion>
              </div>


            </div >
          </>
        )
      }
    </>
  )
}

export default StudentYearAndBranchView
