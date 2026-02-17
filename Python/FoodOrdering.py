from datetime import datetime
import pyodbc
from datetime import datetime
from datetime import datetime
class Menu:
    
    def __init__(self):
        try:
            cnxn = pyodbc.connect("Driver={SQL Server};"
                      "Server=LAPTOP-FBHNE3ES\\SQLEXPRESS;"
                      "Database=Foodiess;"
                      "Trusted_Connection=yes;")
            
            cursor = cnxn.cursor()
            cursor.execute('SELECT * FROM FoodMenu')
            self.records = cursor.fetchall()
            self.menu_dict = {item[0]: {'name': item[1], 'price': float(item[2])} for item in  self.records}
        except:
            print("DataBase Not Found!!!!!")

        finally:
            cursor.close()
            cnxn.close()
            
            
    def show_menu(self):
        print('-'*60)
        print("|{:^54}{:>6s}".format("Welcome to Foodies","|"))
        print("|{:^54}{:>6s}".format("Menu","|"))
        print("|",'-'*57,"|")
        print("|{:<5s} {:30s} {:>15s}{:>8s}".format("SrNo.","Food","Price","|"))

        for i, j in  self.menu_dict.items():
            print("|{:<5} {:28s} {:>18.2f} {:>6s}".format(i, j['name'], j['price'], "|"))
        print('|','-'*57,"|")

class Foodies(Menu):
    
    def __init__(self):
        super().__init__()
        self.orderID = datetime.timestamp(datetime.now())
        self.orders = {}
        self.total_cost = 0
    def take_order(self):
        print(f"\n USER ID: {str(self.orderID)[-5:-1]}")
        usr_inp = input("Enter the sr no. of the food you want to order: ")
        try:
            usr_inp = int(usr_inp)
            if usr_inp in [i for i in range(1,len(self.menu_dict)+1)]:
                while True:
                    try:
                        quant= input("Enter the Quantity in digits: ")
                        quant = int(quant)
                        break
                    except: 
                        print("Enter valid input")
                        
                self.total_cost += self.menu_dict[usr_inp]['price']*quant
                self.orders[len(self.orders)+1] = {'name':self.menu_dict[usr_inp]['name'],'quantity':quant,'price': self.menu_dict[usr_inp]['price'],'dt':datetime.now()}
                print(f"\n USER ID: {str(self.orderID)[-5:-1]}")
                print(f"\n Your Order is: {self.menu_dict[usr_inp]['name']}    Quantity:{quant}     Price: {self.menu_dict[usr_inp]['price']}")
            else:
                print("Enter valid input")
        except:
            print("Enter valid input")
    def deliver_order(self):
        for i in self.orders:
            print(f"\n USER ID: {str(self.orderID)[-5:-1]}")
            print(f"{self.orders[i]['name']} -> Delivered")
        try:
            connection = pyodbc.connect("Driver={SQL Server};"
                      "Server=LAPTOP-FBHNE3ES\\SQLEXPRESS;"
                      "Database=Foodiess;"
                      "Trusted_Connection=yes;")
            cursor = connection.cursor()
            
                # SQL INSERT statement with placeholders (?) for parameters
            sql_insert_query = """
            INSERT INTO FoodOrders (orderID, food_id,food,quantity, price, order_date)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            data_mul = [(int(str(self.orderID).split(".")[1]),i,j['name'],j['quantity'],j['price'],j['dt']) for i,j in self.orders.items()]
            cursor.executemany(sql_insert_query, data_mul)
            connection.commit()
            print(f"{cursor.rowcount} records inserted.")
        except pyodbc.Error as ex:
            sqlstate = ex.args[0]
            if sqlstate == '23000':
                print("An error occurred due to data integrity violation (e.g., duplicate key, foreign key violation).")
            else:
                print("An error occurred in SQL Server:", ex)
            connection.rollback()
        finally:
            if 'connection' in locals():
                cursor.close()
                connection.close()

    
    def generate_bill(self):
        print('-'*60)
        print("|{:^56}{:>4s}".format("Welcome to FOODIES","|"))
        print("|",' '*57,"|")
        print("|{:>17}{:1}{:>10}{:26}{:>3s}".format("Order ID:",str(self.orderID)[-5:-1],"Date:",datetime.now().strftime("%d/%m/%Y,%H:%M:%S"),"|"))
        print("|",'-'*57,"|")
        print("|{:<5s} {:28s} {:>9s} {:>10s}{:>5s}".format("sr","Food","quant","price","|"))
        for e,i in enumerate(self.orders):
            print("|{:<5} {:28s} {:>9} {:>8.2f} {:>6s}".format(e+1,self.orders[i]['name'],self.orders[i]['quantity'],self.orders[i]['price'],"|"))
        print('|','-'*57,"|")
        print("|{:>19s} {:>36.2f} {:>3}".format("Total Cost",self.total_cost,"|"))
        print('|','-'*57,"|")
        self.print_bill()
    def print_bill(self):
        while True:
            try:
                pnt_bill = input("Would you like to print the bill? (Y/N): " )
                if pnt_bill.lower() =="y":
                    file = f"{self.orderID}_receipt.txt"
                    with open(file,'x') as f:
                                print('-'*60,file=f)
                                print("|{:^56}{:>4s}".format("Welcome to FOODIES","|"),file=f)
                                print("|",' '*57,"|",file=f)
                                print("|{:>17}{:1}{:>10}{:26}{:>3s}".format("Order ID:",str(self.orderID)[-5:-1],"Date:",datetime.now().strftime("%d/%m/%Y,%H:%M:%S"),"|"),file=f)
                                print("|",'-'*57,"|",file=f)
                                print("|{:<5s} {:28s} {:>9s} {:>10s}{:>5s}".format("sr","Food","quant","price","|"),file=f)
                                for e,i in enumerate(self.orders):
                                    print("|{:<5} {:28s} {:>9} {:>8.2f} {:>6s}".format(e+1,self.orders[i]['name'],self.orders[i]['quantity'],self.orders[i]['price'],"|"),file=f)
                                print('|','-'*57,"|",file=f)
                                print("|{:>19s} {:>36.2f} {:>3}".format("Total Cost",self.total_cost,"|"),file=f)
                                print('|','-'*57,"|",file=f)
                    break
                elif pnt_bill.lower()=='n':
                    print("Thank you :}")
                    break
                else:
                    print("!!!Please enter correct input ")
            except:
                print("!!!Please enter correct input ")
if __name__ == "__main__":
    
    C1 = Foodies()
    C2 = Foodies()
    
    C1.show_menu()
    C1.take_order()
    C1.deliver_order()
    C2.show_menu()
    C2.take_order()
    C2.generate_bill()
    C1.generate_bill()

    