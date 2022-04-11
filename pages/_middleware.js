import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
	// Token will exist if user is logged in
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	const { pathname } = req.nextUrl;

	// 1) If the user has a token and the user wants to go to the login page => take them to home
	if (token && pathname === "/login") {
		const url = req.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	// Allow the requests if the following is true...
	// 1) It's a request for next-auth session & provider fetching
	// 2) The token exists
	if (pathname.includes("/api/auth") || token) {
		return NextResponse.next();
	}

	// If the user doesn't have a token, they will always be taken to login
	if (!token && pathname !== "/login") {
		const url = req.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}
}
