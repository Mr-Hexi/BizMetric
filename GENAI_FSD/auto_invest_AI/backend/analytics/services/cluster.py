from portfolio.models import Portfolio,Stock


print("Portfolios:")
for portfolio in Portfolio.objects.all():
    print(f" - {portfolio.name}")
