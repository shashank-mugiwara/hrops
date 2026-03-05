def test_reports_stats(client, db_session):
    # Setup some test data
    from backend import models
    from datetime import date

    # 1. Departments & Groups
    dept = models.Department(name="Engineering")
    db_session.add(dept)
    db_session.commit()

    group = models.Group(name="Backend Team", department_id=dept.id)
    db_session.add(group)
    db_session.commit()

    # 2. Candidates
    c1 = models.Candidate(
        candidate_name="Alice",
        candidate_email="alice@test.com",
        status="Active",
        group_id=group.id,
        joining_date=date.today()
    )
    c2 = models.Candidate(
        candidate_name="Bob",
        candidate_email="bob@test.com",
        status="Pending",
        group_id=group.id,
        joining_date=date.today()
    )
    db_session.add_all([c1, c2])
    db_session.commit()

    # 3. Rules
    rule = models.AutomationRule(
        name="Test Rule",
        trigger_days=0,
        trigger_type="before",
        status="active"
    )
    db_session.add(rule)
    db_session.commit()

    # Make the request
    response = client.get("/reports/stats")

    assert response.status_code == 200
    data = response.json()

    # Verify Metric Overview
    assert "metrics" in data
    assert data["metrics"]["total_candidates"] == 2
    assert data["metrics"]["pending_joinees"] == 1
    assert data["metrics"]["active_rules"] == 1

    # Verify Volume by Department
    assert "department_volume" in data
    assert len(data["department_volume"]) == 1
    assert data["department_volume"][0]["label"] == "Engineering"
    assert data["department_volume"][0]["value"] == 2

    # Verify Intake Volume (just structure check)
    assert "intake_volume" in data
    assert len(data["intake_volume"]) == 12
    # The last week (current week) should have 2 hires
    assert data["intake_volume"][-1]["count"] == 2
