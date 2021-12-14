import React, { useEffect, useState } from "react";

// components
import { Input, Button, PasswordInput } from "../common/Elements";
import Register from "./Register";

// icons
import { FcGoogle } from "react-icons/fc";
import { BiArrowBack } from "react-icons/bi";

// alerts
import { useAlert } from "react-alert";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../actions/account/account";
import { login as LGQ } from "../../actions/account/login";

import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

import { useHistory } from "react-router";

// style (sass)
import "./sass/login.scss";

const go = (path) => window.location.replace(path);

const Login = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const history = useHistory();

    const logingState = useSelector((state) => state.login);
    const acc = useSelector((state) => state.account);
    const alerts = useSelector((state) => state.alerts);

    const [formFrag, setFormFrag] = useState("login"); // forgot, register, login, loading

    const [error, setError] = useState(false);
    const [data, setData] = useState({ username: "", password: "" });

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
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (acc.user) {
            history.push("/account");
        }
    }, [acc]);

    useEffect(() => {
        setData({
            ...data,
            username: localStorage.username || "",
            password: localStorage.password || "",
        });
    }, [localStorage]);

    useEffect(() => {
        if (logingState.loading) setFF("loading");
        else setFF("login");
    }, [logingState]);

    const setFF = (frag) => {
        document.querySelectorAll("input").forEach((i) => {
            i.value = "";
        });

        setData({
            username: "",
            password: "",
        });
        setFormFrag(frag);
    };

    let forgotFrag = (
        <>
            <span>Email address</span>
            <Input onChange={(e) => {}} placeholder="Email address" />
            <div className="btn">
                <Button>Send Code</Button>
            </div>
        </>
    );

    let loginFrag = (
        <>
            <span>Username</span>
            <Input
                onChange={(e) => setData({ ...data, username: e.target.value })}
                placeholder="Username"
                error={error}
                autoComp={data.username}
            />
            <span>Password</span>
            <PasswordInput
                onChange={(e) => setData({ ...data, password: e.target.value })}
                error={error}
                autoComp={data.password}
            />

            <a
                onClick={() => {
                    setFF("forgot");
                }}
            >
                Forgot Password
            </a>

            <div className="btn">
                <Button
                    onClick={() => {
                        setFF("register");
                    }}
                >
                    Register
                </Button>
                <Button
                    onClick={() => {
                        dispatch(LGQ(data.username, data.password));
                    }}
                >
                    Login
                </Button>
            </div>
        </>
    );

    let loadingFrag = (
        <div className="form">
            <div className="loading-box">
                <PacmanLoader
                    color="#FFF"
                    loading={logingState.loading}
                    css={css`
                        width: auto;
                        height: auto;
                        margin-left: -90px;
                    `}
                />
            </div>
        </div>
    );

    return (
        <div className="login-page">
            <div className="login-form">
                <div className="cool-img"></div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <BiArrowBack
                        className={
                            "back-icon" +
                            (["register", "forgot"].includes(formFrag)
                                ? " show"
                                : "")
                        }
                        onClick={() => {
                            setFF("login");
                        }}
                    />
                    <div className="form">
                        {formFrag === "loading" && loadingFrag}

                        {formFrag === "login" && loginFrag}
                        {formFrag === "register" && <Register />}
                        {formFrag === "forgot" && forgotFrag}

                        <div className="social">
                            <div className="custom-hr">or</div>
                            <Button
                                className="google"
                                onClick={() => {
                                    go(
                                        "/api/account/login/google/?next=/account"
                                    );
                                }}
                            >
                                {" "}
                                <FcGoogle />{" "}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
