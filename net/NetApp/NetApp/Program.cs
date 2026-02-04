using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Comenzando el programa de .NET");
            while (true) {
                
                string entrada = Console.ReadLine();

                string[] datos = entrada.Split(',');

                string movimiento = datos[0];
                
                string brincar = datos[1];

                string acelerar = datos[2];

       

                if (movimiento.Equals("0"))
                {
                    //No te muevas
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                }
                else if (movimiento.Equals("1"))
                {
                    //Mueve a la derecha
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_D);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                }
                else if (movimiento.Equals("-1"))
                {
                    //Movimiento a la izquierda
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_A);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                }

                if (brincar.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.SPACE);
                }
                else
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.SPACE);
                }

                if (acelerar.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_W);
                    Console.WriteLine(acelerar);
                }
                else
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_W);
                }
            } 
        }
    }
}
