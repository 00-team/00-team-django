import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadProject } from "../../actions/projects/project";
import {
    toggleSproject,
    getProjectStars,
} from "../../actions/account/sprojects";
import { useDispatch, useSelector } from "react-redux";

import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsStar, BsStarFill } from "react-icons/bs";

import { useAlert } from "react-alert";
import VideoPlayer from "../common/VideoPlayer";
import MasterVideo from "master-video";

// style
import "./sass/project.scss";

const StarLord = ({ pid }) => {
    const dispatch = useDispatch();
    const sp = useSelector((s) => s.sprojects.projectStars);

    useEffect(() => {
        dispatch(getProjectStars(pid));
    }, [pid]);

    return (
        <div
            className="stars"
            title={sp.count}
            onClick={() => {
                dispatch(
                    toggleSproject(pid, () => {
                        dispatch(getProjectStars(pid));
                    })
                );
            }}
        >
            {sp.selfStar ? <BsStarFill /> : <BsStar />} <span>{sp.count}</span>
        </div>
    );
};

const DocMaster = ({ docs }) => {
    const [cDocIndex, setCDocIndex] = useState(0);
    const [cDoc, setCDoc] = useState({ type: "NaN" });

    const docIndexHandle = (x) => {
        let cdi = cDocIndex + x;
        if (cdi >= docs.length) cdi = 0;
        if (cdi < 0) cdi = docs.length - 1;

        setCDocIndex(cdi);
        setCDoc(docs[cdi]);
    };

    useEffect(() => {
        if (docs.length > 0) setCDoc(docs[0]);
    }, [docs]);

    return (
        <div className="docs">
            {docs.length > 1 && (
                <>
                    <div
                        className="next"
                        onClick={() => {
                            docIndexHandle(+1);
                        }}
                    >
                        <FiChevronRight />
                    </div>
                    <div
                        className="previous"
                        onClick={() => {
                            docIndexHandle(-1);
                        }}
                    >
                        <FiChevronLeft />
                    </div>
                </>
            )}

            {cDoc.type === "image" && (
                <div
                    className="image-doc"
                    style={{ backgroundImage: `url(${cDoc.image})` }}
                ></div>
            )}
            {cDoc.type === "video" && (
                <div className="video-doc">
                    {/* <VideoPlayer source={cDoc.video} poster={cDoc.thumbnail} /> */}
                    <MasterVideo source={cDoc.video} />
                </div>
            )}
        </div>
    );
};

const Project = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const project = useSelector((s) => s.project);
    const alerts = useSelector((state) => state.alerts);
    const [p, setProject] = useState(null);

    useEffect(() => {
        dispatch(LoadProject(slug));
    }, [dispatch]);

    useEffect(() => {
        if (alerts.info) {
            alert.info(alerts.info);
            dispatch({ type: "INFO_ALERT", payload: null });
        }
        if (alerts.error) {
            alert.error(alerts.error);
            dispatch({ type: "ERROR_ALERT", payload: null });
        }
        if (alerts.success) {
            alert.success(alerts.success);
            dispatch({ type: "SUCCESS_ALERT", payload: null });
        }
    }, [alerts]);

    useEffect(() => {
        if (!project.loading && project.project) {
            setProject(project.project);
        }
    }, [project]);

    const LoadingFlag = (
        <div className="loading-box" style={{ height: "calc(100vh - 60px)" }}>
            <PacmanLoader
                color="#FFF"
                loading={true}
                css={css`
                    width: auto;
                    height: auto;
                `}
            />
        </div>
    );

    const ProjectFlag = p && (
        <>
            <DocMaster docs={p.docs} />

            <div className="info">
                <span className="name" title={p.name}>
                    {p.name}
                </span>
                <StarLord pid={p.id} />
                <div className="hred"></div>
                <div className="langspace">
                    <span className="language" title={p.language}>
                        {p.language}
                    </span>
                    <span className="workspace" title={p.workspace}>
                        {p.workspace}
                    </span>
                </div>
                <div className="hred"></div>
                <div className="langspace">
                    <span className="status" title={p.status}>
                        {p.status}
                    </span>
                    <span className="data" title={p.date_start}>
                        {p.date_start}
                    </span>
                </div>
                <div className="hred"></div>
                {p.git && (
                    <>
                        <a href={p.git} title={"Github Link"}>
                            Github
                        </a>
                        <div className="hred"></div>
                    </>
                )}

                <p>{p.description}</p>
            </div>
        </>
    );

    return (
        <div className="project-page">
            {project.loading && LoadingFlag}
            {p && ProjectFlag}
        </div>
    );
};

export default Project;
