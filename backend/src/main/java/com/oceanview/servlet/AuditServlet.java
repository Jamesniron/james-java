package com.oceanview.servlet;

import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;
import com.oceanview.dao.AuditLogDAO;
import com.oceanview.model.AuditLog;
import com.oceanview.util.ApiResponse;
import com.oceanview.util.GsonUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/audit")
public class AuditServlet extends HttpServlet {

    private final AuditLogDAO auditLogDAO = new AuditLogDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        Gson gson = GsonUtil.getGson();

        List<AuditLog> logs = auditLogDAO.findAll();
        resp.getWriter().write(gson.toJson(ApiResponse.success("Audit logs fetched successfully", logs)));
    }
}
