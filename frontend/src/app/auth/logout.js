"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const logout = () => {
  Cookies.remove("token");
  window.location.href = "/auth";
}

export const Logout = ({classCustom}) => {
  return (
    <button className={`btn px-2 text-neutral-700 btn-xs btn-ghost ${classCustom || ""}`} onClick={logout}>Logout</button>
  )
}