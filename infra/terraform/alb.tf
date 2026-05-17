# -------------------------------------------------------------------
# ALB
# -------------------------------------------------------------------
resource "aws_lb" "main" {
  name               = "v-kara-ec2-unified-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_c.id]
}

# -------------------------------------------------------------------
# Target Group: HTTPS:443 デフォルト（Frontend → EC2 HTTP:80）
# -------------------------------------------------------------------
resource "aws_lb_target_group" "app" {
  name        = "v-kara-ec2-app-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    protocol            = "HTTP"
    path                = "/user/signin"
    port                = "traffic-port"
    interval            = 300
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# -------------------------------------------------------------------
# Target Group: API（backend.v-karaoke.com → EC2 HTTP:8080）
# -------------------------------------------------------------------
resource "aws_lb_target_group" "api" {
  name        = "vkara-api-ec2-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    protocol            = "HTTP"
    path                = "/health"
    port                = "traffic-port"
    interval            = 300
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# -------------------------------------------------------------------
# Target Group: HTTP:80 リスナー用（EC2 に HTTPS:80 で転送）
# -------------------------------------------------------------------
resource "aws_lb_target_group" "app_to_http" {
  name        = "vkara-ec2-app-toHttp-tg"
  port        = 80
  protocol    = "HTTPS"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    protocol            = "HTTP"
    path                = "/user/signup"
    port                = "traffic-port"
    interval            = 300
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# -------------------------------------------------------------------
# Target Group Attachments
# -------------------------------------------------------------------
resource "aws_lb_target_group_attachment" "app" {
  target_group_arn = aws_lb_target_group.app.arn
  target_id        = aws_instance.app.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "api" {
  target_group_arn = aws_lb_target_group.api.arn
  target_id        = aws_instance.app.id
  port             = 8080
}

resource "aws_lb_target_group_attachment" "app_to_http" {
  target_group_arn = aws_lb_target_group.app_to_http.arn
  target_id        = aws_instance.app.id
  port             = 80
}

# -------------------------------------------------------------------
# Listener: HTTP:80
# -------------------------------------------------------------------
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward"

    forward {
      target_group {
        arn    = aws_lb_target_group.app_to_http.arn
        weight = 1
      }
      stickiness {
        enabled  = false
        duration = 3600
      }
    }
  }
}

# -------------------------------------------------------------------
# Listener: HTTPS:443
# -------------------------------------------------------------------
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-Res-2021-06"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type = "forward"

    forward {
      target_group {
        arn    = aws_lb_target_group.app.arn
        weight = 1
      }
      stickiness {
        enabled  = false
        duration = 3600
      }
    }
  }
}

# -------------------------------------------------------------------
# Listener Rule: backend.v-karaoke.com → API（priority 1）
# -------------------------------------------------------------------
resource "aws_lb_listener_rule" "backend" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 1

  action {
    type = "forward"

    forward {
      target_group {
        arn    = aws_lb_target_group.api.arn
        weight = 1
      }
      stickiness {
        enabled  = false
        duration = 3600
      }
    }
  }

  condition {
    host_header {
      values = ["backend.v-karaoke.com"]
    }
  }
}
