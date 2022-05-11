import React, { useEffect, useState } from 'react';
import './Spacex.css';

const Spacex = () => {
    const [data, setData] = useState([]);
    const [years, setYears] = useState([]);
    const [selected, setSelected] = useState('');
    const [launch, setLaunch] = useState([]);
    const [land, setLand] = useState([]);

    /*-------------------------------- 
     | Fetching default loading data |
     -------------------------------*/

    useEffect(() => {
        fetch('https://api.spacexdata.com/v3/launches?limit=100')
            .then(res => res.json())
            .then(data => {
                setData(data);
                let uniqueYears = [];
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if (!uniqueYears.includes(element.launch_year)) {
                        uniqueYears.push(element.launch_year)
                    }
                }
                setYears(uniqueYears);
            });

    }, []);

    /*------------------------------------------------------ 
     | Checking Launch Success condition and fetching data |
     -----------------------------------------------------*/

    const launchTrueFalse = data => {
        if (data === true) {
            setLaunch(true);
            fetch(`https://api.spacexdata.com/v3/launches?limit=100&launch_success=true`)
                .then(res => res.json())
                .then(data => setData(data));
        } else {
            setLaunch(false);
            fetch(`https://api.spacexdata.com/v3/launches?limit=100&launch_success=false`)
                .then(res => res.json())
                .then(data => setData(data));
        }
    }

    /*------------------------------------------------------ 
     | Checking Land Success condition and fetching data |
     -----------------------------------------------------*/

    const landTrueFalse = data => {
        if (data === true) {
            setLand(true);
            fetch(`https://api.spacexdata.com/v3/launches?limit=100&launch_success=true&land_success=true`)
                .then(res => res.json())
                .then(data => setData(data));
        } else {
            setLand(false);
            fetch(`https://api.spacexdata.com/v3/launches?limit=100&launch_success=true&land_success=false`)
                .then(res => res.json())
                .then(data => setData(data));
        }
    }

    /*----------------------------------------------- 
     | Checking Land Success value and display data |
     -----------------------------------------------*/

    const checkLandSuccess = landStatus => {
        let status = '';
        if (landStatus === null) {
            status = 'null';
        }
        else if (landStatus === true) {
            status = 'true';
        } else {
            status = 'false';
        }
        return status;
    }

    /*---------------------------------- 
     | Checking year and fetching data |
     ----------------------------------*/

    const yearValuePicker = yearValue => {
        setSelected(yearValue);
        fetch(`https://api.spacexdata.com/v3/launches?limit=100&launch_year=${parseInt(yearValue)}`)
            .then(res => res.json())
            .then(data => setData(data));
    }

    return (
        <section className="container">
            <h1>SpaceX Launch Programs</h1>
            <div className="main-content">

                {/*-------------- 
                  | Filter Area |
                  -------------*/}

                <div className="filter">
                    <h2>Filters</h2>
                    <p className="border-bottom">Launch Year</p>
                    <div className="btn-wraper">
                        <div className="btn-grid">

                            {/*--------------------- 
                              | Launch Year Button |
                              --------------------*/}
                            {
                                years.map(yearBtn => <button className={
                                    selected === yearBtn
                                        ? "active-color"
                                        : "non-active-color"
                                } onClick={() => { yearValuePicker(yearBtn) }}>{yearBtn}</button>)
                            }
                        </div>
                    </div>
                    <p className="border-bottom">Successfull Launch</p>
                    <div className="btn-wraper">
                        <div className="btn-set">

                            {/*--------------------------- 
                              | Successful Launch Button |
                              ---------------------------*/}

                            <button className={
                                launch === true ? "active-color" : "non-active-color"
                            } onClick={() => launchTrueFalse(true)}>True</button>
                            <button className={
                                launch === false ? "active-color" : "non-active-color"
                            } onClick={() => launchTrueFalse(false)}>False</button>
                        </div>
                    </div>
                    <p className="border-bottom">Successfull Landing</p>
                    <div className="btn-wraper">
                        <div className="btn-set">

                            {/*------------------------- 
                              | Successful Land Button |
                              ------------------------*/}

                            <button className={
                                land === true ? "active-color" : "non-active-color"
                            } onClick={() => landTrueFalse(true)}>True</button>
                            <button className={
                                land === false ? "active-color" : "non-active-color"
                            } onClick={() => landTrueFalse(false)}>False</button>
                        </div>
                    </div>
                </div>
                <div className="card-body">

                    {/*----------------------------- 
                      | Card area and data display |
                      ----------------------------*/}

                    {
                        data.map(launch => <div className="card">
                            <img className="img" src={launch?.links?.mission_patch_small} alt="" />
                            <h3>{launch?.mission_name} #{launch?.flight_number}</h3>
                            <h4>Mission Ids: </h4>
                            <ul className="list">
                                {launch?.mission_id.map(singleMission => <li>{singleMission}</li>)}
                            </ul>
                            <h4>Launch Year: {launch?.launch_year}</h4>
                            <h4>Launch Success: {launch?.launch_success === true ? 'true' : 'false'}</h4>
                            <h4>Land Success: {checkLandSuccess(launch?.rocket?.first_stage?.cores[0].land_success)}</h4>
                        </div>)
                    }
                </div>
            </div>
        </section>
    );
};

export default Spacex;