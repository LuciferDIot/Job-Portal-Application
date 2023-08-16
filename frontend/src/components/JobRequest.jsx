import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'
import { useTable } from "react-table";
import axios from "axios";
import NavigationBar from "./elements/Navigation";

const JobRequest = ({ userType, userDetails, setUserDetails }) => {
    const [extractedData, setExtractedData] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `http://localhost:3005/jobrequests/${userType}/${userDetails.email}`;
                const response = await axios.get(url);

                if (response.status === 200) {
                    const extractedData = response.data.map((originalData, index) => ({
                        index: index + 1,
                        job: originalData.job,
                        description: originalData.description,
                        date: originalData.date,
                        isAccepted: originalData.isAccepted,
                        provider: getShortName(originalData.provider.firstName, originalData.provider.lastName),
                        consumer: getShortName(originalData.consumer.firstName, originalData.consumer.lastName),
                        _id: originalData._id
                    }));

                    setExtractedData(extractedData);
                    setUpdate(false)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        if (userDetails.email) {
            fetchData();
        }
    }, [userDetails.email, userType, update]);









    const handleAccept = async (item) => {
        const jobId = item._id;
        try {
            const response = await axios.put(`http://localhost:3005/jobrequests/${jobId}/123?isAccepted=true`)
            if (response.status === 200) setUpdate(true)
            else if (response.status === 404) console.log('job request not found');
            else console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemove = async (item) => {
        const jobId = item._id;
        try {
            const response = await axios.delete(`http://localhost:3005/jobrequests/remove/${jobId}`)
            if (response.status === 200) setUpdate(true)
            else if (response.status === 404) console.log('job request not found');
            else console.log(response);
        } catch (error) {
            console.log(error);
        }

    }




    const columns = React.useMemo(() => [
        {
            Header: "Id",
            accessor: "index"
        },
        {
            Header: "Title",
            accessor: "job"
        },
        {
            Header: "Description",
            accessor: "description"
        },
        {
            Header: userType === 'consumer' ? "" : "Consumer",
            accessor: "consumer",
            disableHeader: column => column.value === 'consumer' && userType === 'consumer'
        },
        {
            Header: userType === 'provider' ? "" : "Provider",
            accessor: "provider",
            disableHeader: column => column.value === 'provider' && userType === 'provider'
        },
        {
            Header: "Date",
            accessor: "date"
        },
        {
            Header: "Accepted",
            accessor: "isAccepted"
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data: extractedData });

    return (
        <div className=" flex justify-between flex-col items-center w-screen h-screen">
            <NavigationBar userType={userType} userDetails={userDetails} setUserDetails={setUserDetails} />

            <div className="container lg:w-[1500px] h-full flex justify-center pt-10">
                <table {...getTableProps()} className="lg:w-11/12 max-sm:overflow-scroll">
                    <thead className="border bg-black text-white w-full shadow-2xl backdrop-reflect-below">
                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th key={column.id} {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr key={row.id} {...row.getRowProps()} className="text-sm text-center">
                                    {row.cells.map((cell) => (
                                        <td key={cell.column.id} {...cell.getCellProps()} className="px-2 py-2">

                                            {
                                                cell.column.id === 'date' ? (
                                                    <>
                                                        <div>{formatDate(row.original.date)}</div>
                                                        <div>{formatTime(row.original.date)}</div>
                                                    </>
                                                ) : (
                                                    cell.column.id === 'isAccepted' ? (
                                                        cell.value === 'true' ? (
                                                            userType === 'consumer' ?
                                                                (
                                                                    <button onClick={() => handleRemove(row.original)} className="bg-red-500 hover:bg-red-400 p-2 text-white rounded-md text-sm w-full mx-2">Remove</button>
                                                                ) :
                                                                (
                                                                    <button disabled className="bg-gray-400 hover:bg-gray-300 p-2 text-white rounded-md text-sm w-full mx-2">Accepted</button>
                                                                )
                                                        ) : (
                                                            userType === 'provider' ?
                                                                (
                                                                    <button onClick={() => handleAccept(row.original)} className="bg-blue-500 hover:bg-blue-400 p-2 text-white rounded-md text-sm w-full mx-2"> Accept </button>
                                                                ) :
                                                                (
                                                                    <button disabled className="bg-gray-400 hover:bg-gray-300 p-2 text-white rounded-md text-sm w-full mx-2">Requested</button>
                                                                )
                                                        )
                                                    ) : (
                                                        cell.column.id === 'consumer' && userType === 'consumer' ?
                                                            (
                                                                <></>
                                                            )
                                                            :
                                                            (
                                                                cell.column.id === 'provider' && userType === 'provider' ?
                                                                    (
                                                                        <></>
                                                                    )
                                                                    : cell.render("Cell")
                                                            )
                                                    )
                                                )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    );

    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()}`;
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    function getShortName(firstName, lastName) {
        const firstWords = firstName.split(' ').slice(0, 1);
        const lastWords = lastName.split(' ');
        const lastTwo = lastWords.length >= 2 ? lastWords.slice(0, 2) : lastWords
        return `${firstWords.join(' ')} ${lastTwo.join(' ')}`;
    }
};

JobRequest.propTypes = {
    userType: PropTypes.string.isRequired,
    userDetails: PropTypes.object.isRequired,
    setUserDetails: PropTypes.func.isRequired
}

export default JobRequest;
