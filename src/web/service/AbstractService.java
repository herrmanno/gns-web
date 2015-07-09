package web.service;

import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import web.servlets.MainFilter;

abstract public class AbstractService {

	public final Pattern regex;
	protected MainFilter servlet;

	public AbstractService(String regex) {
		this.regex = Pattern.compile(regex);
	}
	
	public void setServlet(MainFilter filter) {
		this.servlet = filter;
	}
	
	abstract public void service(HttpServletRequest req, HttpServletResponse resp) throws Exception;
}
