from django.core.management.base import BaseCommand

from portfolio.models import Portfolio, Stock


class Command(BaseCommand):
    help = "Seed Automobile and Healthcare portfolios with top Indian stocks."

    PORTFOLIOS = {
        "Automobile": {
            "description": "Top 10 Indian automobile sector stocks.",
            "stocks": [
                ("TATAMOTORS", "Tata Motors Ltd.", 725.0),
                ("MARUTI", "Maruti Suzuki India Ltd.", 11350.0),
                ("M&M", "Mahindra & Mahindra Ltd.", 1975.0),
                ("BAJAJ-AUTO", "Bajaj Auto Ltd.", 8850.0),
                ("HEROMOTOCO", "Hero MotoCorp Ltd.", 4625.0),
                ("TVSMOTOR", "TVS Motor Company Ltd.", 2315.0),
                ("ASHOKLEY", "Ashok Leyland Ltd.", 228.0),
                ("EICHERMOT", "Eicher Motors Ltd.", 4650.0),
                ("ESCORTS", "Escorts Kubota Ltd.", 3245.0),
                ("SONACOMS", "Sona BLW Precision Forgings Ltd.", 718.0),
            ],
        },
        "Healthcare": {
            "description": "Top 10 Indian healthcare and pharma sector stocks.",
            "stocks": [
                ("SUNPHARMA", "Sun Pharmaceutical Industries Ltd.", 1655.0),
                ("DRREDDY", "Dr. Reddy's Laboratories Ltd.", 6450.0),
                ("CIPLA", "Cipla Ltd.", 1480.0),
                ("DIVISLAB", "Divi's Laboratories Ltd.", 3910.0),
                ("LUPIN", "Lupin Ltd.", 1665.0),
                ("AUROPHARMA", "Aurobindo Pharma Ltd.", 1180.0),
                ("BIOCON", "Biocon Ltd.", 335.0),
                ("TORNTPHARM", "Torrent Pharmaceuticals Ltd.", 2870.0),
                ("ABBOTINDIA", "Abbott India Ltd.", 28650.0),
                ("GLAND", "Gland Pharma Ltd.", 1825.0),
            ],
        },
    }

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0
        for portfolio_name, payload in self.PORTFOLIOS.items():
            portfolio, _ = Portfolio.objects.get_or_create(
                name=portfolio_name,
                defaults={"description": payload["description"]},
            )

            for symbol, company_name, current_price in payload["stocks"]:
                stock, created = Stock.objects.get_or_create(
                    symbol=symbol,
                    defaults={
                        "portfolio": portfolio,
                        "company_name": company_name,
                        "sector": portfolio_name,
                        "current_price": current_price,
                    },
                )
                if created:
                    created_count += 1
                    continue

                dirty_fields = []
                if stock.portfolio_id != portfolio.id:
                    stock.portfolio = portfolio
                    dirty_fields.append("portfolio")
                if stock.company_name != company_name:
                    stock.company_name = company_name
                    dirty_fields.append("company_name")
                if stock.sector != portfolio_name:
                    stock.sector = portfolio_name
                    dirty_fields.append("sector")
                if stock.current_price != current_price:
                    stock.current_price = current_price
                    dirty_fields.append("current_price")

                if dirty_fields:
                    stock.save(update_fields=dirty_fields)
                    updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeding complete. Stocks created: {created_count}, "
                f"stocks updated: {updated_count}."
            )
        )
