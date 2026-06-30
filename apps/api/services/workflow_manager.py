# -*- coding: utf-8 -*-
"""工作流管理服务 - Workflow Manager"""

from typing import Dict, List, Optional

from schemas.agent import TaskPlan, WorkflowStatus


class WorkflowManager:
    """工作流管理器（全局单例）

    管理工作流状态，内存存储工作流历史。
    """

    _instance: Optional["WorkflowManager"] = None

    def __new__(cls) -> "WorkflowManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._workflows: Dict[str, WorkflowStatus] = {}
        self._initialized = True

    def create_workflow(self, workflow_id: str, steps: List[TaskPlan]) -> WorkflowStatus:
        """创建工作流"""
        workflow = WorkflowStatus(
            workflow_id=workflow_id,
            status="planning",
            steps=steps,
            progress=0.0,
        )
        self._workflows[workflow_id] = workflow
        return workflow

    def get_workflow_status(self, workflow_id: str) -> Optional[WorkflowStatus]:
        """获取工作流状态"""
        return self._workflows.get(workflow_id)

    def update_step(self, workflow_id: str, step: TaskPlan) -> Optional[WorkflowStatus]:
        """更新工作流中的步骤状态"""
        workflow = self._workflows.get(workflow_id)
        if workflow is None:
            return None

        for idx, s in enumerate(workflow.steps):
            if s.id == step.id:
                workflow.steps[idx] = step
                break

        # 重新计算进度
        total = len(workflow.steps)
        done = sum(1 for s in workflow.steps if s.status == "done")
        workflow.progress = round((done / total) * 100, 1) if total > 0 else 0.0

        # 自动更新工作流状态
        if workflow.progress == 0.0:
            workflow.status = "planning"
        elif 0.0 < workflow.progress < 100.0:
            workflow.status = "executing"
        elif workflow.progress == 100.0:
            workflow.status = "merging"

        return workflow

    def complete_workflow(self, workflow_id: str) -> Optional[WorkflowStatus]:
        """标记工作流完成"""
        workflow = self._workflows.get(workflow_id)
        if workflow is None:
            return None
        workflow.status = "completed"
        workflow.progress = 100.0
        return workflow

    def set_error(self, workflow_id: str) -> Optional[WorkflowStatus]:
        """标记工作流出错"""
        workflow = self._workflows.get(workflow_id)
        if workflow is None:
            return None
        workflow.status = "error"
        return workflow

    def list_workflows(self) -> List[WorkflowStatus]:
        """列出所有工作流"""
        return list(self._workflows.values())


# 全局单例
workflow_manager = WorkflowManager()
