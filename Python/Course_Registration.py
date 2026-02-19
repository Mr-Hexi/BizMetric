'''13.	Ask user to opt for courses for master degree based on the following
L1 = [“HR”, “Finance”, “Marketing”, “DS”]
Based on above subject there are two different streams. For example- HR is having HR core and HR analytics and Marketing is having core and Marketing analytics. Analytics is the optional subject and having added extra fees. DS is not having analytics.
If fees for L1 is 2 lakhs for each course core subject having the same fees but analytics subject having 10% extra on 2 lakhs.
If student opts for hostel then 2 lakhs per year is added. For food monthly 2000 .
Transportation charges 13000 per semester. Calculate the total annual cost based on selected service.  
User will enter values as subject, analytics(Y/N), Hostel (Y/N), food(How many months?), Transportation(semester/annual)
'''
        
        
class CourseRegistration:
    
    '''
    Docstring for CourseRegistration
    
    Course Registration class with methods that let's student to  opt for courses,hostel,food,transport
    
    '''
    

    def __init__(self):
        self.L1 = ['HR', 'Finance', 'Marketing', 'DS']
        self.base_fees = 200000
        self.analytics_extra = 0.10
        self.hostel_fees = 200000
        self.food_per_month = 2000
        self.transport_per_sem = 13000
        self.receipt = {}
        self.total_cost = 0

    def CourseSelection(self):
        
        '''
        
        Method for course selection
        
        '''
    
        for e,i in enumerate(self.L1):
            print(f"{e+1}. {i}")
        try:
            self.cs = int(input("Enter the Course no. you want to opt: "))
            if self.cs in list(range(len(self.L1)+1)):
                self.receipt['Course'] = self.L1[self.cs-1]
                self.receipt['Course_fees'] = self.base_fees
                print(f"you opted for {self.L1[self.cs-1]}")
                self.total_cost+=self.base_fees
            else:
                print("Enter value Between 1-4")
        except:
            print("Invalid Input")

    def CourseStream(self):
        '''
        
        Method for opting Course Stream 
        
        '''
        try:
            if self.cs!=4:
                stream = input("Opt for Analytics? (Y/N): ")
                if stream.lower() =='y':
                    
                    self.receipt['Stream'] = 'Analytical'
                    extra_fees= self.base_fees*self.analytics_extra
                    self.receipt['Analytical_fees'] = extra_fees 
                    self.total_cost+= extra_fees 
                    print(f"Your Stream is {self.L1[self.cs-1]} {'Core'} + {'Analytical'}")
                elif stream.lower() =='n':
                    self.receipt['Stream'] = 'Core'
                    print(f"Your Stream is {self.L1[self.cs-1]} {'Core'}")
                    self.receipt['Analytical_fees'] = 0
                else:
                    print("Enter Valid Input")
        except:
            print("Invalid Input")

    def ChooseHotel(self):
                
        '''
        
        Method for opting Hotel 
        
        '''
        try:
            hostel = input("Hostel required? (Y/N): ")
            if hostel.lower() == 'y':
                self.total_cost += self.hostel_fees
                self.receipt['Hostel'] = self.hostel_fees
                self.total_cost+= self.hostel_fees
                print(f"you opted for Hostel")
            elif hostel.lower() == 'n':
                self.receipt['Hostel'] = 0
                print(f"you did not opted for Hostel")
            else:
                print("Enter Valid Input")
        except:
            print("Invalid Input")

    def ChooseFood(self):
        
        '''
        
        Method for opting for food
        
        '''
        try:
            food = input("Food required? (Y/N): ")
            if food.lower() == 'y':
                months = int(input("How many months? "))
                if months <=12 and months >0:
                    food_cost = self.food_per_month * months
                    self.total_cost += food_cost
                    self.receipt['Food'] = food_cost
                    self.total_cost+= food_cost
                    print(f"you opted for Food for {months} Months")
                else:
                    print("Enter valid input")
            elif food.lower() == 'n':
                self.receipt['Food'] = 0
                print("you did not opted for Food ")
            else:
                print("Enter Valid Input")
        except:
            print("Invalid Input")

    def ChooseTransport(self):
        
        '''
        
        Method for opting Transport
        
        '''

        try:
            trans = input("Transport required? (Y/N): ")
            if trans.lower() == 'y':
                trans_type = input("Choose Transportation: 1. Semester 2. Annual\n")
                if trans_type in ['1' ,'2']:
                    self.transport_per_sem*=int(trans_type)
                    t_cost = self.transport_per_sem 
                    self.total_cost += t_cost
                    self.receipt['Transport Charges'] = t_cost
                    if trans_type==1:
                        print(f"you opted for Transport for 1 Semester ")
                    else:
                        print(f"you opted for Transport annually ")
                else:
                    print("Enter valid input")
            elif trans.lower() == 'n':
                self.receipt['Transport Charges'] = 0
            else:
                print("Enter valid input")
        except Exception as e:
            print("Invalid Input",e)

    def GenerateBill(self):
        
        
        '''
        
        Method for Generating Bill
        
        '''

        try:
            print('-'*60)
            print("|{:^54}{:>6s}".format("WELCOME TO COURSE REGISTRATION","|"))
            print("|{:^54}{:>6s}".format("RECEIPT","|"))
            print("|", '-'*57, "|")
            print("|{:<5s} {:28s} {:>9s} {:>10s}{:>5s}".format("sr", "Item", "Type", "Amount", "|"))
            print("|", '-'*57, "|")
            sr = 1
            for key, value in self.receipt.items():
                if isinstance(value, (int, float)):
                    amount = str(value)
                    typ = "Fee"
                else:
                    amount = "-"
                    typ = str(value)
                print("|{:<5} {:28s} {:>9s} {:>10s}{:>5s}".format(sr, key, typ, amount, "|"))
                sr += 1
            print("|", '-'*57, "|")
            print("|{:>25s} {:>28.2f} {:>5}".format("Total Cost", self.total_cost, "|"))
            print("|", '-'*57, "|")
        except Exception as e:
            print("Bill generation error:", e)


if __name__ == "__main__":
    u1=  CourseRegistration()
    u1.CourseSelection()
    u1.CourseStream()
    u1.ChooseHotel()
    u1.ChooseFood()
    u1.ChooseTransport()
    u1.GenerateBill()